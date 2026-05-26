package com.shalom.shalom_balloon_art.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.shalom.shalom_balloon_art.auth.logger.SecurityEventLogger;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
@RequiredArgsConstructor
public class FirebaseConfig {

   @Value("${firebase.config:}")
   private String firebaseConfig;

    private final SecurityEventLogger securityEventLogger;

    @Bean
    public FirebaseApp initializeFirebase(){

        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        InputStream serviceAccount = null;

        try {
            if (firebaseConfig != null && !firebaseConfig.isBlank()) {
                serviceAccount = new ByteArrayInputStream(
                        firebaseConfig.getBytes(StandardCharsets.UTF_8)
                );
            } else {
                serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase/serviceAccountKey.json");
            }

            if (serviceAccount == null) {
                    securityEventLogger.warn("FIREBASE_INIT_SKIP", "firebase_serviceAccountKey_null - Firebase 기능을 비활성화합니다.");
                    return null;
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("shalom-balloon-art.firebasestorage.app")
                    .build();

            return FirebaseApp.initializeApp(options);

        } catch (Exception e) {
            securityEventLogger.warn("FIREBASE_INIT_ERROR", e.getMessage());
            return null;
        }
        finally{
            if(serviceAccount != null){
                try{
                    serviceAccount.close();
                }catch(IOException e){

                }
            }
        }

    }

}
