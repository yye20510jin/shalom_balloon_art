package com.shalom.shalom_balloon_art.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequestDTO {

    private String title;
    private String content;
    private List<String> imageUrls; // ← 여기
    private String youtubeUrl;

    // getter/setter
}