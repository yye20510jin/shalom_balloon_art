package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.config.ViewLimitProperties;
import com.shalom.shalom_balloon_art.dto.post.PostCreateRequestDTO;
import com.shalom.shalom_balloon_art.dto.post.PostListResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.PostResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.PostTagDTO;
import com.shalom.shalom_balloon_art.entity.post.Post;
import com.shalom.shalom_balloon_art.entity.post.PostUserLike;
import com.shalom.shalom_balloon_art.entity.post.PostViewUser;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.entity.post.Tags;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.*;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.INTERNAL_SERVER_ERROR;
import static com.shalom.shalom_balloon_art.global.error.ErrorCode.POST_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final FirebaseStorageService fire;
    private final ViewLimitProperties viewLimitProperties;
    private final PostViewUserRepository postViewUserRepository;
    private final PostDailyViewRepository postDailyViewRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final PostUserLikeRepository postUserLikeRepository;

    // 글 저장
    public void createPost(PostCreateRequestDTO req){
        Post p = Post.from(req);

        for(String tagName : req.getPostTag()){
            Tags t = tagRepository.findByTagName(tagName).orElseThrow(() -> new BusinessException(INTERNAL_SERVER_ERROR));
            p.getPostTag().add(t);
        }

        Post saved = postRepository.save(p);
    }

    // 글 자세히 보기
    public PostResponseDTO getPost(Long index) {
        Post post = postRepository.findById(index)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
        return toResponseDTO(post);
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

    //전체 목록 조회 (홈페이지)
    public List<PostListResponseDTO> getHomeAllPosts(){
        return postRepository.findAll().stream().map(this::toListResponseDTO).toList();
    }

    //전체 목록 조회 (페이지네이션)
    public Page<PostListResponseDTO> getAllPosts(int page, String searchTitle){
        Pageable pageable = PageRequest.of(page,10);

        if (searchTitle.isBlank()){
            return postRepository.findAll(pageable).map(this::toListResponseDTO);
        }else{
            return postRepository.findByTitleContainingIgnoreCase(searchTitle,pageable).map(this::toListResponseDTO);
        }

    }

    private PostListResponseDTO toListResponseDTO(Post post) {
        return PostListResponseDTO.builder()
                .index(post.getIndex())
                .title(post.getTitle())
                .thumbnailUrl(post.getThumbnailUrl())
                .preview(makePreview(post.getContentHtml(),160))
                .postTag(post.getPostTag().stream().map(PostTagDTO::from).toList())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    // 글 미리보기
    private String makePreview(String html, int maxLen){
        if(html == null || html.isBlank()) return "";
        String text = Jsoup.parse(html).text();
        text = text.replaceAll("\\s+"," ").trim();
        if(text.length() <= maxLen) return text;
        return text.substring(0,maxLen);
    }

    private PostResponseDTO toResponseDTO(Post post) {
        return PostResponseDTO.builder()
                .index(post.getIndex())
                .title(post.getTitle())
                .contentHtml(post.getContentHtml())
                .thumbnailUrl(post.getThumbnailUrl())
                .postTags(post.getPostTag().stream().map(PostTagDTO::from).toList())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    //글 수정
    public PostResponseDTO editPost(Long index,PostCreateRequestDTO dto) {

        Post post = postRepository.findById(index)
                .orElseThrow(() -> new BusinessException(POST_NOT_FOUND));

        //새로 들어온 썸네일 여부
        boolean hasNewThumb = dto.getThumbnailUrl() != null && !dto.getThumbnailUrl().isBlank();
        //새로 들어온 썸네일과 기존 썸네일 일치 여부
        boolean changedThumb = hasNewThumb && !dto.getThumbnailUrl().equals(post.getThumbnailUrl());

        if(changedThumb){
            if(post.getThumbnailUrl() != null && !post.getThumbnailUrl().isBlank()){
                fire.delete(post.getThumbnailUrl());}
            post.setThumbnailUrl(dto.getThumbnailUrl());
        }
        post.getPostTag().clear();
        List<Tags> newTags = dto.getPostTag().stream().map(name -> tagRepository.findByTagName(name).orElseGet(() -> tagRepository.save(new Tags(name)))).toList();
        post.getPostTag().addAll(newTags);
        post.update(dto.getTitle(), dto.getContentHtml());
        return toResponseDTO(post);
    }

    //글 삭제
    public void deletePost(Long index, List<String> imagePaths){
        Post post = postRepository.findById(index).orElseThrow(() -> new RuntimeException("id 없음"));
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