package com.shalom.shalom_balloon_art;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class ShalomBalloonArtApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShalomBalloonArtApplication.class, args);
	}

}
