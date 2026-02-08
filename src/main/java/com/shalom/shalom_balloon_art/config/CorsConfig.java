package com.shalom.shalom_balloon_art.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import java.util.Map;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource configurationSource(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        //JWT를 Authorization 헤더로만 보내면 false
        config.setAllowCredentials(false);
        //브라우저가 CORS 허용 결과를 지정 시간동안 기억
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //모든 경로에 대해 이 config라는 CORS 규칙 적용
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
