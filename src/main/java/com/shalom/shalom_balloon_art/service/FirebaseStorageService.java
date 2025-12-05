package com.shalom.shalom_balloon_art.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;

@Service
public class FirebaseStorageService {
    public void delete(String imageUrl){
        // Firebase Storage URL -> 파일 경로만 추출
        String fileName = imageUrl.substring(imageUrl.indexOf("/o/") + 3, imageUrl.indexOf("?alt"));
        fileName = fileName.replace("%2F", "/"); // URL encoding 제거

        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.get(fileName);

        if (blob != null) {
            blob.delete();
        } else {
            throw new RuntimeException("⚠ Firebase 파일 없음");
        }
    }
}
