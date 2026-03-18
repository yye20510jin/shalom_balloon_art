package com.shalom.shalom_balloon_art.auth.jwt;

import com.shalom.shalom_balloon_art.auth.logger.LoggingAuthenticationEntryPoint;
import com.shalom.shalom_balloon_art.auth.resetToken.ResetTokenCookieUtil;
import com.shalom.shalom_balloon_art.service.CustomUserDetailsService;
import com.shalom.shalom_balloon_art.service.auth.RefreshService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshService refreshService;
    private final CustomUserDetailsService customUserDetailsService;
    private final LoggingAuthenticationEntryPoint entryPoint;
    private final ResetTokenCookieUtil resetTokenCookieUtil;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = resolveToken(request);

        //토큰이 없으면 그냥 다음 필터로
        if (token == null || token.isBlank()){
            filterChain.doFilter(request,response);
            return;
        }

        //토큰 검증
        try{
            TokenStatus status = jwtTokenProvider.validateDetailed(token);
            switch(status){
                case VALID ->{
                    newAuthCreate(token);
                }
                case EXPIRED -> {
                    request.setAttribute("AUTH_DETAIL","TOKEN_EXPIRED");
                    throw new InsufficientAuthenticationException("TOKEN_EXPIRED");
                }
                default -> {
                    request.setAttribute("AUTH_DETAIL","TOKEN_INVALID");
                    throw new BadCredentialsException("TOKEN_INVALID: " + status);
                }
            }

        }catch(AuthenticationException ex){
            SecurityContextHolder.clearContext();
            entryPoint.commence(request, response, ex);
        }

        filterChain.doFilter(request, response);
    }


    private String resolveToken(HttpServletRequest request){
        String header = request.getHeader("Authorization");
        if(header != null && header.startsWith("Bearer ")){
            return header.substring(7);
        }
        return null;
    }
    private void newAuthCreate(String token){
        String userId = jwtTokenProvider.getUserId(token);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(userId);
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
