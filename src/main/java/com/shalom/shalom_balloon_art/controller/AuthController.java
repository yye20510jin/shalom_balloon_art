package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.LoginResponseDTO;
import com.shalom.shalom_balloon_art.dto.MembershipRequestDTO;
import com.shalom.shalom_balloon_art.dto.user.FindMembershipDTO;
import com.shalom.shalom_balloon_art.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    //관리자 로그인
    @PostMapping("/adminLogin")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequestDTO l) {
        Map<String, Object> result;
        result = authService.adminLogin(l);
        List<String> roles = ((List<?>) result.get("roles")).stream().map(String::valueOf).toList();
        return ResponseEntity.ok(new LoginResponseDTO((String) result.get("token"), (String) result.get("userId"), roles));
    }

    //유저 로그인
    @PostMapping("/userLogin")
    public ResponseEntity<?> userLogin(@RequestBody LoginRequestDTO l) {
        Map<String, Object> result;
        result = authService.userLogin(l);
        List<String> roles = ((List<?>) result.get("roles")).stream().map(String::valueOf).toList();
        return ResponseEntity.ok(new LoginResponseDTO((String) result.get("token"), (String) result.get("userId"), roles));
    }

    //회원 가입
    @PostMapping("/membership")
    public ResponseEntity<?> membership(@RequestBody MembershipRequestDTO m) {
        authService.signupRequest(m);
        return ResponseEntity.ok("회원가입 성공");
    }

    //아이디 중복 체크
    @PostMapping("/idDuplicateCheck")
    public ResponseEntity<?> idDuplicateCheck(@RequestBody MembershipRequestDTO m) {
        authService.idDuplicateCheck(m.getUserId());
        return ResponseEntity.ok("사용 가능한 아이디입니다.");
    }

    //회원탈퇴(UserController로 이전)
    @DeleteMapping("/membership")
    public void unregister(@AuthenticationPrincipal CustomUserDetails cud){
        authService.unregister(cud.getUserIndex());
    }

    //아이디 찾기
    @PostMapping("/findId")
    public ResponseEntity<String> findId(@RequestBody FindMembershipDTO f){
        return ResponseEntity.ok(authService.findId(f));
    }


}
