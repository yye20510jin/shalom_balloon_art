package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.PostCreateRequestDTO;
import com.shalom.shalom_balloon_art.dto.PostImageDTO;
import com.shalom.shalom_balloon_art.dto.PostResponseDTO;
import com.shalom.shalom_balloon_art.entity.Post;
import com.shalom.shalom_balloon_art.entity.PostImage;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    // 글 저장
    public void createPost(PostCreateRequestDTO req){
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());

        if(req.getImageUrls() != null){
            for(String url : req.getImageUrls()){
                post.addImage(url);
            }
        }
        Post saved = postRepository.save(post);
    }

    // 글 하나 조회
    public PostResponseDTO getPost(Long index) {
        Post post = postRepository.findById(index)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        return toResponseDTO(post);
    }

    // 전체 목록 조회
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream().map(this::toResponseDTO).toList();
    }

    private PostResponseDTO toResponseDTO(Post post) {

        List<PostImageDTO> imageDos = post.getImages().stream().map(img -> new PostImageDTO(img.getIndex(),img.getUrl())).toList();

        return PostResponseDTO.builder()
                .index(post.getIndex())
                .title(post.getTitle())
                .content(post.getContent())
                .imageUrl(imageDos)
                .youtubeUrl(post.getYoutubeUrl())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @Transactional
    public PostResponseDTO editPost(PostCreateRequestDTO dto) {

        Post post = postRepository.findById(dto.getIndex())
                .orElseThrow(() -> new RuntimeException("게시글 없음"));

        // 1. 기본 필드 수정
        post.update(dto.getTitle(), dto.getContent(), dto.getYoutubeUrl());
        // 2. 기존 이미지 전부 제거
        post.clearImages(); // orphanRemoval=true라 DB에서도 삭제

        // 3. 새 이미지 전부 다시 추가
        if (dto.getImageUrls() != null) {
            for (String url : dto.getImageUrls()) {
                post.addImage(url);
            }
        }

        // 4. 저장 (변경감지로 자동 flush)
        return toResponseDTO(post);
    }


}