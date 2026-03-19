package com.shalom.shalom_balloon_art.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

   @Value("${firebase.config:}")
   private String firebaseConfig;

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {

        if(!FirebaseApp.getApps().isEmpty()){
            return FirebaseApp.getInstance();
        }

        InputStream serviceAccount;

        if(firebaseConfig != null && !firebaseConfig.isBlank()){
            serviceAccount = new ByteArrayInputStream(
                    firebaseConfig.getBytes(StandardCharsets.UTF_8)
            );
        }else{
            serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase/serviceAccountKey.json");
            if (serviceAccount == null) {
                throw new IllegalStateException("Firebase serviceAccountKey.json not found in classpath");
            }
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket("shalom-balloon-art.firebasestorage.app") // 🔥 너의 bucket
                .build();


           return FirebaseApp.initializeApp(options);
    }

}
