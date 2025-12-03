package com.shalom.shalom_balloon_art.dto;

import com.shalom.shalom_balloon_art.entity.PostImage;
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
    private String content;
    private List<PostImageDTO> imageUrl;
    private String youtubeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}