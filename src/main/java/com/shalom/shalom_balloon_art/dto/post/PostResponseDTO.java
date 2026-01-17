package com.shalom.shalom_balloon_art.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDTO {

    private Long index;
    private String title;
    private String contentHtml;
    private String thumbnailUrl;
    private List<PostTagDTO> postTags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}