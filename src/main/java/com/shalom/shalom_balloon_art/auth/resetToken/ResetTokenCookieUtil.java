package com.shalom.shalom_balloon_art.auth.resetToken;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ResetTokenCookieUtil {



    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${cookie.same-site}")
    private String cookieSameSite;

    private static final Logger log = LoggerFactory.getLogger(ResetTokenCookieUtil.class);

    public String readCookie(HttpServletRequest req) {
        Cookie[] cookies = req.getCookies();

        if (cookies == null) {
            log.warn("refresh request: no cookies");
        } else {
            for (Cookie c : cookies) {
                log.info("cookie name={}, valueExists={}", c.getName(), c.getValue() != null && !c.getValue().isBlank());
            }
        }

        if (cookies == null) return null;
        for (Cookie c : cookies) if ("refreshToken".equals(c.getName())) return c.getValue();
        return null;
    }

    public void setRefreshCookie(HttpServletResponse res, String token, java.time.Duration ttl) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/api/auth/refresh")
                .maxAge(ttl)
                .build();
        res.addHeader("Set-Cookie", cookie.toString());
    }

    public void deleteRefreshCookie(HttpServletResponse res) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/api/auth/refresh")
                .maxAge(0)
                .build();
        res.addHeader("Set-Cookie", cookie.toString());
    }

    public record AccessTokenResponse(String accessToken, String userId ,List<String> roles) {}
}
