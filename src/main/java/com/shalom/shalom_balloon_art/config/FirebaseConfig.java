package com.shalom.shalom_balloon_art.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("src/main/resources/firebase/serviceAccountKey.json");

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket("shalom-balloon-art.firebasestorage.app") // 🔥 너의 bucket
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
           return FirebaseApp.initializeApp(options);
        }else{
            return null;
        }
    }

}
