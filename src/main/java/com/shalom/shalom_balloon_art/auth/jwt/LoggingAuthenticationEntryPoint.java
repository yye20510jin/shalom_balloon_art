package com.shalom.shalom_balloon_art.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shalom.shalom_balloon_art.global.error.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.AUTH_UNAUTHORIZED;

@Component
@RequiredArgsConstructor
public class LoggingAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final SecurityEventLogger secLog;
    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        secLog.warn("AUTH_401", request, null,
                String.format(
                        "type=%s, reason=%s",
                        authException.getClass().getSimpleName(),
                        authException.getMessage()
                ));

        String detail =(String) request.getAttribute("AUTH_DETAIL");
        if (detail == null) detail = "TOKEN_INVALID";

        response.setStatus(AUTH_UNAUTHORIZED.getStatus().value());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.
                writeValueAsString(ErrorResponse.from(AUTH_UNAUTHORIZED,request,detail)));
    }
}
