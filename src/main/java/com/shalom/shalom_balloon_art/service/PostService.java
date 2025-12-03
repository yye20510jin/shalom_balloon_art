package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.PostCreateRequestDTO;
import com.shalom.shalom_balloon_art.dto.PostImageDTO;
import com.shalom.shalom_balloon_art.dto.PostResponseDTO;
import com.shalom.shalom_balloon_art.entity.Post;
import com.shalom.shalom_balloon_art.entity.PostImage;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    // 글 저장
    public Long createPost(PostCreateRequestDTO req){
        Post post = new Post();
        post.setTitle(req.getTitle());
        post.setContent(req.getContent());

        if(req.getImageUrls() != null){
            System.out.println("--------if문--------");
            for(String url : req.getImageUrls()){
                post.addImage(url);
            }
        }
        Post saved = postRepository.save(post);
        return saved.getIndex();
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


}