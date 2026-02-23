package com.shalom.shalom_balloon_art.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public RequestIdFilter requestIdFilter() {
        return new RequestIdFilter();
    }

    @Bean
    public FilterRegistrationBean<RequestIdFilter> requestIdFilterRegistration(RequestIdFilter filter){
        FilterRegistrationBean<RequestIdFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(filter);
        reg.setOrder(0);
        reg.addUrlPatterns("/*");
        return reg;
    }
}
