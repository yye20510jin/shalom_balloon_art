package com.shalom.shalom_balloon_art.auth.jwt;

import com.shalom.shalom_balloon_art.auth.resetToken.ResetTokenCookieUtil;
import com.shalom.shalom_balloon_art.service.CoustomUserDetailsService;
import com.shalom.shalom_balloon_art.service.auth.RefreshService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshService refreshService;
    private final CoustomUserDetailsService customUserDetailsService;
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
                //프론트 : 메인 페이지로 이동 + 로그아웃
                //서버 : refresh 로그아웃, 로그
            TokenStatus status = jwtTokenProvider.validateDetailed(token);
            switch(status){
                case VALID ->{
                    // 유효하면 인증 세팅
                    newAuthCreate(token);
                }
                case EXPIRED -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json; charset=UTF-8");
                    response.getWriter().write("{\"error\":\"TOKEN_EXPIRED\"}");
                    return;
                }
                default -> {
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
