package com.shalom.shalom_balloon_art.auth.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class LoggingAccessDeniedHandler implements AccessDeniedHandler {

    private final SecurityEventLogger secLog;

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        secLog.warn("AUTH_403", request, auth,
                String.format(
                        "type=%s, reason=%s",
                        accessDeniedException.getClass().getSimpleName(),
                        accessDeniedException.getMessage()
                ));

        response.sendError(HttpServletResponse.SC_FORBIDDEN);
    }
}