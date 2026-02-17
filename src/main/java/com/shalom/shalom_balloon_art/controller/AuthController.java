package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.auth.resetToken.ResetTokenCookieUtil;
import com.shalom.shalom_balloon_art.dto.login.*;
import com.shalom.shalom_balloon_art.service.AuthService;
import com.shalom.shalom_balloon_art.service.PasswordResetService;
import com.shalom.shalom_balloon_art.service.auth.RefreshService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    private final RefreshService refreshService;
    private final ResetTokenCookieUtil resetTokenCookieUtil;


    private final Duration REFRESH_TTL;

    public AuthController(AuthService authService, PasswordResetService passwordResetService, RefreshService refreshService, ResetTokenCookieUtil resetTokenCookieUtil, @Value("${jwt.refresh-ttl}")Duration refreshTtl) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
        this.refreshService = refreshService;
        this.resetTokenCookieUtil = resetTokenCookieUtil;
        REFRESH_TTL = refreshTtl;
    }


    //관리자 로그인
    @PostMapping("/adminLogin")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequestDTO l, HttpServletResponse res) {
        AccessTokenWithRoles result = authService.adminLogin(l);
        String refresh = refreshService.newRefreshToken(result.userId());
        resetTokenCookieUtil.setRefreshCookie(res,refresh,REFRESH_TTL);
        return ResponseEntity.ok(new LoginResponseDTO(result.accessToken(),result.userId(),result.roles()));
    }

    //유저 로그인
    @PostMapping("/userLogin")
    public ResponseEntity<?> userLogin(@RequestBody LoginRequestDTO l, HttpServletResponse res) {
        AccessTokenWithRoles result = authService.userLogin(l);
        String refresh = refreshService.newRefreshToken(result.userId());
        resetTokenCookieUtil.setRefreshCookie(res,refresh,REFRESH_TTL);
        return ResponseEntity.ok(new LoginResponseDTO(result.accessToken(),result.userId(), result.roles()));
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

    // ----비밀번호 수정 토큰---- //
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

    // ----- refresh ------ //

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest req, HttpServletResponse res) {
        String refresh = resetTokenCookieUtil.readCookie(req);
        if (refresh == null || refresh.isBlank()) {
            return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(Map.of("code","NO_REFRESH"));
        }

        try {
            var pair = refreshService.rotate(refresh);
            resetTokenCookieUtil.setRefreshCookie(res, pair .refreshToken(), pair.refreshTtl());
            return ResponseEntity.ok(new ResetTokenCookieUtil.AccessTokenResponse(pair.at().accessToken(),pair.at().userId(),pair.at().roles()));
        } catch (RuntimeException e) {
            resetTokenCookieUtil.deleteRefreshCookie(res);
            return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(Map.of("code","UNAUTHORIZED"));
        }
    }

    // 로그아웃 refresh 제거
    @PostMapping("/refresh/logout")
    public ResponseEntity<Void> logout(@CookieValue(value="refreshToken", required=false) String refresh, HttpServletResponse res){
        if (refresh != null) {
            refreshService.logout(refresh); // Redis revokeOne or revokeAll
        }
        resetTokenCookieUtil.deleteRefreshCookie(res);
        return ResponseEntity.ok().build();
    }



}
