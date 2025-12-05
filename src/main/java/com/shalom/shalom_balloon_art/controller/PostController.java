package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.PostCreateRequestDTO;
import com.shalom.shalom_balloon_art.dto.PostResponseDTO;
import com.shalom.shalom_balloon_art.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 글 작성 (ADMIN만)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createPost(@RequestBody PostCreateRequestDTO dto) {
        postService.createPost(dto);
        return ResponseEntity.ok("success");
    }

    // 전체 글 목록 (누구나)
    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAllPosts() {
        System.out.println("글 목록 접근 완료");
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // 글 하나 조회 (USER만)
    @GetMapping("/{index}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<PostResponseDTO> getPost(@PathVariable Long index) {
        return ResponseEntity.ok(postService.getPost(index));
    }

    //글 수정
    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editPost(@RequestBody PostCreateRequestDTO dto){

        return ResponseEntity.ok(postService.editPost(dto));
    }

    //글 삭제
    @DeleteMapping("/{index}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePost(@PathVariable Long index){
        postService.deletePost(index);
        return ResponseEntity.ok("success");
    }
}