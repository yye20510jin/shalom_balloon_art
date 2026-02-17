package com.shalom.shalom_balloon_art.auth.resetToken;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResetTokenCookieUtil {
    public String readCookie(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();

        if (cookies == null) return null;
        for (Cookie c : cookies) if ("refreshToken".equals(c.getName())) return c.getValue();
        return null;
    }

    public void setRefreshCookie(HttpServletResponse res, String token, java.time.Duration ttl) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false)              // ✅ 실배포 HTTPS // 수정) secure(true)변경
                .sameSite("Lax") // 실배포 수정) sameSite(none) 변경
                .path("/api/auth/refresh") // ✅ refresh에만 전송
                .maxAge(ttl)
                .build();
        res.addHeader("Set-Cookie", cookie.toString());
    }

    public void deleteRefreshCookie(HttpServletResponse res) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();
        res.addHeader("Set-Cookie", cookie.toString());
    }

    public record AccessTokenResponse(String accessToken, String userId ,List<String> roles) {}
}
