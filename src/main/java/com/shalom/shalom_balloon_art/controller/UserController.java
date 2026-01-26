package com.shalom.shalom_balloon_art.controller;

import com.google.monitoring.v3.Service;
import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.dto.login.ResetConfirmDTO;
import com.shalom.shalom_balloon_art.dto.post.PostListResponseDTO;
import com.shalom.shalom_balloon_art.dto.user.CheckPasswordDTO;
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

    // 비밀번호 확인
    @PostMapping("/chkPw")
    public ResponseEntity<Void> chkPw(@AuthenticationPrincipal CustomUserDetails cud, @RequestBody CheckPasswordDTO c){
        userService.chkPw(cud.getUserIndex(), c.getCheckPassword());
        return ResponseEntity.ok().build();
    }

    //비밀번호 수정
    @PostMapping("/changePw")
    public ResponseEntity<Void> userChangePw(@AuthenticationPrincipal CustomUserDetails cud, @RequestBody ResetConfirmDTO r){
        userService.userChangePw(cud.getUserIndex(), r.getNewPassword());
        return ResponseEntity.ok().build();
    }

}
