package com.shalom.shalom_balloon_art.dto.post;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostMetaDTO {
    private Long postIndex;
    private String title;
    private int total;
}
