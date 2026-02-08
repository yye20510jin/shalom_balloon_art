package com.shalom.shalom_balloon_art.config;

import com.shalom.shalom_balloon_art.auth.jwt.JwtAuthenticationFilter;
import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.service.CoustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
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
public class SecurityConfig {
    private final CorsConfig corsConfig;
    private final JwtTokenProvider jwtTokenProvider;
    private final CoustomUserDetailsService customUserDetailsService;

    public SecurityConfig(CorsConfig corsConfig,JwtTokenProvider jwtTokenProvider,CoustomUserDetailsService customUserDetailsService){
        this.corsConfig = corsConfig;
        this.jwtTokenProvider = jwtTokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // REST API에서 기본적으로 사용
                .csrf(csrf -> csrf.disable())
                .cors(cors->cors.configurationSource(corsConfig.configurationSource()))
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
                        new JwtAuthenticationFilter(jwtTokenProvider,customUserDetailsService),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
