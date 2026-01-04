package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.PostCreateRequestDTO;
import com.shalom.shalom_balloon_art.dto.PostListResponseDTO;
import com.shalom.shalom_balloon_art.dto.PostResponseDTO;
import com.shalom.shalom_balloon_art.entity.Post;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final FirebaseStorageService fire;

    // 글 저장
    public void createPost(PostCreateRequestDTO req){
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContentHtml(req.getContentHtml());
        post.setThumbnailUrl(req.getThumbnailUrl());
        Post saved = postRepository.save(post);
    }

    // 글 하나 조회
    public PostResponseDTO getPost(Long index) {
        Post post = postRepository.findById(index)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
        post.viewUpdate();
        return toResponseDTO(post);
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
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    //글 수정
    public PostResponseDTO editPost(Long index,PostCreateRequestDTO dto) {

        Post post = postRepository.findById(index)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        boolean hasNewThumb = dto.getThumbnailUrl() != null && !dto.getThumbnailUrl().isBlank();
        boolean changedThumb = hasNewThumb && !dto.getThumbnailUrl().equals(post.getThumbnailUrl());

        if(changedThumb){
            if(post.getThumbnailUrl() != null && !post.getThumbnailUrl().isBlank()){
                fire.delete(post.getThumbnailUrl());}
            post.setThumbnailUrl(dto.getThumbnailUrl());
        }
        post.update(dto.getTitle(), dto.getContentHtml());
        return toResponseDTO(post);
    }


    public void deletePost(Long index, List<String> imagePaths){
        Post post = postRepository.findById(index).orElseThrow(() -> new RuntimeException("id 없음"));
        // Firebase 이미지 삭제 로직
        fire.delete(post.getThumbnailUrl());
        for(String url : imagePaths) {
            fire.deleteHtml(url);
        }
        postRepository.delete(post);
    }

}