package com.shalom.shalom_balloon_art.auth.resetToken;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class ResetTokenCookieUtil {
    public String readCookie(HttpServletRequest req) {
        System.out.println("-- ResetTokenCookieUtil readCookie 쿠키 읽어오기 -- ");
        Cookie[] cookies = req.getCookies();

        if (cookies == null) return null;
        for (Cookie c : cookies) {
            System.out.println("name=" + c.getName()
                    + ", value=" + c.getValue());
            if ("refreshToken".equals(c.getName())) return c.getValue();
        }
        return null;
    }

    public void setRefreshCookie(HttpServletResponse res, String token, java.time.Duration ttl) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false)              // ✅ 실배포 HTTPS
                .sameSite("Lax")
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

    public record AccessTokenResponse(String accessToken) {}
}
