package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.dto.login.*;
import com.shalom.shalom_balloon_art.service.AuthService;
import com.shalom.shalom_balloon_art.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final PasswordResetService passwordResetService;

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



    //아이디 찾기
    @PostMapping("/findId")
    public ResponseEntity<String> findId(@RequestBody FindIdDTO f){
        return ResponseEntity.ok(authService.findId(f));
    }

    //----비밀번호 수정 토큰----
    @PostMapping("/resetPw")
    public ResponseEntity<ResetTokenResponseDTO> resetPw(@RequestBody ResetRequestDTO r){
        String token = passwordResetService.requestReset(r.getUserId(), r.getUserPhoneNumber());
        return ResponseEntity.ok(new ResetTokenResponseDTO(token));
    }

    @PostMapping("/validateTokenPw")
    public ResponseEntity<Void> validateTokenPw(@RequestBody ResetConfirmDTO r){
        passwordResetService.getValidToken(r.getToken(),null);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/confirmPw")
    public ResponseEntity<Void> confirmPw(@RequestBody ResetConfirmDTO r){
        passwordResetService.confirmReset(r.getToken(), r.getNewPassword());
        return ResponseEntity.ok().build();
    }
    // -----------------------
}
