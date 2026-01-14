package com.shalom.shalom_balloon_art.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix="view.limit")
@Getter
@Setter
public class ViewLimitProperties {
    private int minutes;
}
