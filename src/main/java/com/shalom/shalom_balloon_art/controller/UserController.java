package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.dto.post.PostListResponseDTO;
import com.shalom.shalom_balloon_art.service.PostService;
import com.shalom.shalom_balloon_art.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("http://localhost:5173")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PostService postService;

    //회원탈퇴
    @DeleteMapping("/membership")
    public ResponseEntity<Void> unregister(@AuthenticationPrincipal CustomUserDetails cud){
        userService.unregister(cud.getUserIndex());
        return ResponseEntity.ok().build();
    }

    //좋아요 글 목록
    @GetMapping("/userLikePosts")
    public ResponseEntity<Page<PostListResponseDTO>> userLikePosts(@AuthenticationPrincipal CustomUserDetails cud, @RequestParam(defaultValue="0") int page){
        return ResponseEntity.ok(userService.getUserLikePosts(cud.getUserIndex(),page));
    }

}
