package com.shalom.shalom_balloon_art.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDTO {

    private String title;
    private String content;
    private String imageUrl;   // Firebase downloadURL
    private String youtubeUrl;
}