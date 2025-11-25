package com.shalom.shalom_balloon_art.auth.jwt;

import com.shalom.shalom_balloon_art.service.CoustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CoustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, CoustomUserDetailsService customUserDetailsService){
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = resolveToken(request);

        if(token != null && jwtTokenProvider.validateToken(token)){
            String userId = jwtTokenProvider.getUserId(token);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userId);

            UsernamePasswordAuthenticationToken auth =new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
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
}
