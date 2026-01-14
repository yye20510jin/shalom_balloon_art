package com.shalom.shalom_balloon_art.dto.post;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequestDTO {
    private Long index;
    private String title;
    private String contentHtml;
    private String thumbnailUrl;
    // getter/setter
}