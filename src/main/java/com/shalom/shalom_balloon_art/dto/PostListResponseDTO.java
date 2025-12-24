package com.shalom.shalom_balloon_art.dto;

import com.shalom.shalom_balloon_art.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class PostListResponseDTO {
        private Long index;
        private String title;
        private String preview;
        private String thumbnailUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
