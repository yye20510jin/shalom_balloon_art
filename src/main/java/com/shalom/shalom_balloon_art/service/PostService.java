package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.auth.sanitizer.HtmlSanitizer;
import com.shalom.shalom_balloon_art.config.ViewLimitProperties;
import com.shalom.shalom_balloon_art.dto.post.*;
import com.shalom.shalom_balloon_art.entity.post.*;
import com.shalom.shalom_balloon_art.entity.User.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.*;
import com.shalom.shalom_balloon_art.repository.post.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.*;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final HtmlSanitizer htmlSanitizer;
    private final PostRepository postRepository;
    private final FirebaseStorageService fire;
    private final ViewLimitProperties viewLimitProperties;
    private final PostViewUserRepository postViewUserRepository;
    private final PostDailyViewRepository postDailyViewRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final PostUserLikeRepository postUserLikeRepository;
    private final PostTagRepository postTagRepository;

    // 글 저장
    public void createPost(PostCreateRequestDTO req){

        String safeHtml = htmlSanitizer.sanitizePostHtml(req.getContentHtml());
        Post p = Post.builder().title(req.getTitle()).contentHtml(safeHtml)
                .thumbnailUrl(req.getThumbnailUrl()).supplies(req.getSupplies()).build();

        for(String tagName : req.getPostTag()){
            Tags t = tagRepository.findByTagName(tagName).orElseThrow(() -> new BusinessException(TAG_NOT_FOUND,""));
            PostTag.of(p,t);
        }

        postRepository.save(p);
    }

    // 글 자세히 보기
    @Transactional(readOnly = true)
    public PostResponseDTO getPost(Long postIndex, Long userIndex) {
        Post post = postRepository.findById(postIndex)
                .orElseThrow(() -> new BusinessException(POST_NOT_FOUND,""));

        List<Tags> t = postTagRepository.findTagsByPostIndex(postIndex);
        List<PostTagDTO> pt = t.stream().map(PostTagDTO::from).toList();

        boolean likedPost = postUserLikeRepository.existsByIdPostIndexAndIdUserIndex(post.getIndex(),userIndex);

        return PostResponseDTO.from(post, pt, likedPost);
    }

    // 글 좋아요
    public void postUserLike(Long postIndex, int chk, Long userIndex){
        if(chk == 0){
            postUserLikeRepository.deleteByIdPostIndexAndIdUserIndex(postIndex, userIndex);
            return;
        }

        boolean exists = postUserLikeRepository.existsByIdPostIndexAndIdUserIndex(postIndex, userIndex);

        if(exists) return;

        Post post = postRepository.getReferenceById(postIndex);
        User user = userRepository.getReferenceById(userIndex);

        postUserLikeRepository.save(PostUserLike.of(post, user));
    }

    //전체 목록 조회 (페이지네이션)
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getSearchPosts(CustomUserDetails cud , int page, PostSearchCond cond){
        Long userIndex = cud.getUserIndex();
        Pageable pageable = PageRequest.of(page,6);
        return postRepository.search(cond,pageable).map(p-> PostListResponseDTO.from(p,
                postTagRepository.findTagsByPostIndex(p.getIndex()).stream().map(PostTagDTO::from).toList(),
                postUserLikeRepository.existsByIdPostIndexAndIdUserIndex(p.getIndex(),userIndex)));

    }

    //비슷한 글 조회 (페이지네이션)
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getSimilarPosts(int page, Long postIndex){
        Pageable pageable = PageRequest.of(page,6);
        // 해당 인덱스에 있는 태그 목록 가져오기
        List<Tags> tags = postTagRepository.findTagsByPostIndex(postIndex);

        // 해당 인덱스에 있는 태그와 같은 목록 가져오기
        List<Long> tagIndex = tags.stream().map(Tags::getTagIndex).toList();

        return postRepository.similarSearch(tagIndex, pageable).map(p->PostListResponseDTO.from(p,List.of(),false));
    }

    //글 수정
    public PostResponseDTO editPost(Long index,PostCreateRequestDTO dto, Long userIndex) {

        Post post = postRepository.findById(index)
                .orElseThrow(() -> new BusinessException(POST_NOT_FOUND,""));

        //새로 들어온 썸네일 여부
        boolean hasNewThumb = dto.getThumbnailUrl() != null && !dto.getThumbnailUrl().isBlank();
        //새로 들어온 썸네일과 기존 썸네일 일치 여부
        boolean changedThumb = hasNewThumb && !dto.getThumbnailUrl().equals(post.getThumbnailUrl());

        if(changedThumb){
            if(post.getThumbnailUrl() != null && !post.getThumbnailUrl().isBlank()){
                fire.delete(post.getThumbnailUrl());}
            post.setThumbnailUrl(dto.getThumbnailUrl());
        }
        post.clearPostTags();
        List<Tags> newTags = dto.getPostTag().stream().map(name -> tagRepository.findByTagName(name).orElseGet(() -> tagRepository.save(new Tags(name)))).toList();
        for(Tags tag : newTags){
            PostTag.of(post,tag);
        }

        String safeHtml = htmlSanitizer.sanitizePostHtml(dto.getContentHtml());

        post.update(dto.getTitle(), safeHtml, dto.getSupplies());

        List<PostTagDTO> pt = post.getPostTags().stream()
                .map(PostTag::getTag)
                .map(PostTagDTO::from)
                .toList();

        boolean likedPost = postUserLikeRepository.existsByIdPostIndexAndIdUserIndex(post.getIndex(),userIndex);

        return PostResponseDTO.from(post,pt,likedPost);
    }

    //글 삭제
    public void deletePost(Long index, List<String> imagePaths){
        Post post = postRepository.findById(index).orElseThrow(() -> new BusinessException(POST_NOT_FOUND,""));
        postRepository.delete(post);
        postRepository.flush();
        // Firebase 이미지 삭제 로직
        fire.delete(post.getThumbnailUrl());
        for(String url : imagePaths) {
            fire.deleteHtml(url);
        }
    }

    //N분 제한 조회수 증가
    public void recordView(Long postIndex, Long userIndex){
       int minutes = viewLimitProperties.getMinutes();

       PostViewUser existing = postViewUserRepository.findForUpdate(postIndex, userIndex).orElse(null);

       LocalDateTime now = LocalDateTime.now();

       if (existing != null){
           LocalDateTime allowedAt = existing.getLastViewedAt().plusMinutes(minutes);
           if(now.isBefore(allowedAt)){return;}
           existing.updateLastViewedAt(now);
       }else{
           Post postRef = postRepository.getReferenceById(postIndex);
           User userRef = userRepository.getReferenceById(userIndex);
           PostViewUser created = new PostViewUser(postRef, userRef);
           created.updateLastViewedAt(now);
           postViewUserRepository.save(created);
       }
        //일별 집계
        postDailyViewRepository.upsertIncrease(postIndex, now.toLocalDate());
        //누적 집계
        postRepository.incrementViews(postIndex);
    }
}