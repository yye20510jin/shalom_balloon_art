package com.shalom.shalom_balloon_art.config;

import com.shalom.shalom_balloon_art.auth.jwt.JwtAuthenticationFilter;
import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.auth.logger.LoggingAccessDeniedHandler;
import com.shalom.shalom_balloon_art.auth.logger.LoggingAuthenticationEntryPoint;
import com.shalom.shalom_balloon_art.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final CorsConfig corsConfig;
    private final LoggingAccessDeniedHandler deniedHandler;
    private final LoggingAuthenticationEntryPoint entryPoint;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    String cspPolicy = """
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' https: data:;
    connect-src 'self' https://api.shalomballoonart.com;
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
    media-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
    """.replace("\n", " ").replace("\r", " ");

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives(cspPolicy)
                        )
                )
                // REST API에서 기본적으로 사용
                .csrf(csrf -> csrf.disable())
                .cors(cors->cors.configurationSource(corsConfig.configurationSource()))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(entryPoint)   // ✅ 401
                        .accessDeniedHandler(deniedHandler)      // ✅ 403
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // 로그인 API는 누구나 접근 가능
                        .requestMatchers("/api/auth/**").permitAll()
                        //authenticated() => admin만 탈 수 있게 조건 변경
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        //회원 인증 필요 (/api/user/**)
                        .requestMatchers("/api/user/**").authenticated()
                        .anyRequest().permitAll()
                )

                // UsernamePasswordAuthenticationFilter 앞에 JWT 필터 추가
                .addFilterBefore(
                       jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
