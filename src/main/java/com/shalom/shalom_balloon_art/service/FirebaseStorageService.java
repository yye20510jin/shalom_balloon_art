package com.shalom.shalom_balloon_art.service;

import com.google.cloud.storage.*;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class FirebaseStorageService {
    public void delete(String imageUrl){
        // Firebase Storage URL -> 파일 경로만 추출
        String fileName = imageUrl.substring(imageUrl.indexOf("/o/") + 3, imageUrl.indexOf("?alt"));
        fileName = URLDecoder.decode(fileName, StandardCharsets.UTF_8);

        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.get(fileName);
        if (blob == null) {
            throw new RuntimeException("Firebase 파일 없음: " + fileName);
        }
        try {
            blob.delete();
        } catch (StorageException e) {
            throw new RuntimeException("Firebase 삭제 실패: " + e.getMessage(), e);
        }
    }

    public void deleteHtml(String img){
        Bucket bucket = StorageClient.getInstance().bucket();
        Blob blob = bucket.get(img);
        if(blob == null){ throw new RuntimeException("Firebase 파일 없음");}
        try{blob.delete();}catch(StorageException e){throw new RuntimeException("Firebase 삭제 실패");}
    }
}
