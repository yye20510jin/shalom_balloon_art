package com.shalom.shalom_balloon_art;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@ConfigurationPropertiesScan
//@ConfigurationProperties가 붙은 클래스를 찾아 Bean으로 등록해라
@SpringBootApplication
public class ShalomBalloonArtApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShalomBalloonArtApplication.class, args);
	}

}
