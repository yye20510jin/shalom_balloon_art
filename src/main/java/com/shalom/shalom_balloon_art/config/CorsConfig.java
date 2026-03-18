package com.shalom.shalom_balloon_art.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String allowedMethods;

    @Value("${cors.allowed-headers}")
    private String allowedHeaders;

    @Value("${cors.allow-credentials}")
    private boolean allowCredentials;

    @Value("${cors.max-age}")
    private long maxAge;

    @Bean
    public CorsConfigurationSource configurationSource(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(
                Arrays.stream(allowedOrigins.split(",")).map(String::trim).toList()
        );
        config.setAllowedMethods(
                Arrays.stream(allowedMethods.split(",")).map(String::trim).toList()
        );
        config.setAllowedHeaders(
                Arrays.stream(allowedHeaders.split(",")).map(String::trim).toList()
        );
        config.setAllowCredentials(allowCredentials);

        //브라우저가 CORS 허용 결과를 지정 시간동안 기억
        config.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        //모든 경로에 대해 이 config라는 CORS 규칙 적용
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
