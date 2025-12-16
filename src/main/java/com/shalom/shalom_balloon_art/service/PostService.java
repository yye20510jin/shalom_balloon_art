package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.PostCreateRequestDTO;
import com.shalom.shalom_balloon_art.dto.PostImageDTO;
import com.shalom.shalom_balloon_art.dto.PostListResponseDTO;
import com.shalom.shalom_balloon_art.dto.PostResponseDTO;
import com.shalom.shalom_balloon_art.entity.Post;
import com.shalom.shalom_balloon_art.entity.PostImage;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
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

        return toResponseDTO(post);
    }

    // 전체 목록 조회
    public List<PostListResponseDTO> getAllPosts() {
        return postRepository.findAll().stream().map(this::toListResponseDTO).toList();
    }

    private PostListResponseDTO toListResponseDTO(Post post) {
        return PostListResponseDTO.builder()
                .index(post.getIndex())
                .title(post.getTitle())
                .thumbnailUrl(post.getThumbnailUrl())
                .preview(makePreview(post.getContentHtml(),80))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

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


    public PostResponseDTO editPost(PostCreateRequestDTO dto) {

        Post post = postRepository.findById(dto.getIndex())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        // 1. 기존 썸네일 Firebase 삭제 로직
        fire.delete(post.getThumbnailUrl());
        // 2. 기본 필드 수정
        post.update(dto.getTitle(), dto.getContentHtml(),dto.getThumbnailUrl());
        // 3. 저장 (변경감지로 자동 flush)
        return toResponseDTO(post);
    }


    public void deletePost(Long index){
        Post post = postRepository.findById(index).orElseThrow(() -> new RuntimeException("id 없음"));
        // Firebase 이미지 삭제 로직
        fire.delete(post.getThumbnailUrl());
        postRepository.delete(post);
    }


}