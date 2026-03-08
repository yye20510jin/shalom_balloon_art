package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.dto.post.*;
import com.shalom.shalom_balloon_art.service.AdminService;
import com.shalom.shalom_balloon_art.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {


    private final PostService postService;
    private final AdminService adminService;

    // 글 작성 (ADMIN만)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createPost(@RequestBody PostCreateRequestDTO dto) {
        postService.createPost(dto);
        return ResponseEntity.ok("success");
    }

    // 전체 글 목록 (페이지네이션)
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<PostListResponseDTO>> getAllPosts(@AuthenticationPrincipal CustomUserDetails cud,@RequestParam(defaultValue="0")int page, @RequestParam(defaultValue="") String searchTitle, @RequestParam List<Long> searchTags) {
        PostSearchCond cond = new PostSearchCond(searchTitle, searchTags);
        return ResponseEntity.ok(postService.getSearchPosts(cud ,page,cond));
    }

    // 비슷한 글 목록 (페이지네이션)
    @GetMapping("/similarPosts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<PostListResponseDTO>> getSimilarPosts(@RequestParam(defaultValue="0")int page, @RequestParam(defaultValue="")Long postIndex){
        return ResponseEntity.ok().body(postService.getSimilarPosts(page,postIndex));
    }

    // 글 하나 조회
    @GetMapping("/{index}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponseDTO> getPost(@PathVariable Long index, @AuthenticationPrincipal CustomUserDetails cud ) {
        Long userIndex = cud.getUserIndex();
        postService.recordView(index, userIndex);
        return ResponseEntity.ok(postService.getPost(index, userIndex));
    }

    //좋아요
    @PostMapping("/{index}/{chk}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> postUserLike( @PathVariable Long index, @PathVariable int chk, @AuthenticationPrincipal CustomUserDetails cud){
        Long userIndex = cud.getUserIndex();
        postService.postUserLike(index, chk, userIndex);
        return ResponseEntity.ok("ok");
    }
    //글 수정
    @PutMapping("/{index}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponseDTO> editPost(@PathVariable Long index,@RequestBody PostCreateRequestDTO dto, @AuthenticationPrincipal CustomUserDetails cud){
        Long userIndex = cud.getUserIndex();
        return ResponseEntity.ok(postService.editPost(index,dto, userIndex));
    }

    //글 삭제
    @DeleteMapping("/{index}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePost(@PathVariable Long index, @RequestBody List<String> imagePaths){
        postService.deletePost(index,imagePaths);
        return ResponseEntity.ok("success");
    }

    //태그 가져오기
    @GetMapping("/getPostTag")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PostTagDTO>> getPostTag(){
        return ResponseEntity.ok(adminService.getPostTag());
    }

    //태그 추가
    @PostMapping("/addPostTag")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostTagDTO> addPostTag(@RequestBody PostTagDTO t){
        return ResponseEntity.ok(adminService.createOrGet(t.getTagName()));
    }



}