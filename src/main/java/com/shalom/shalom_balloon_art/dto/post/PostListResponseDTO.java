package com.shalom.shalom_balloon_art.dto.post;

import com.shalom.shalom_balloon_art.entity.post.Post;
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

public class PostListResponseDTO {
        private Long index;
        private String title;
        private String preview;
        private String thumbnailUrl;
        private String supplies;
        private List<PostTagDTO> postTag;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static PostListResponseDTO from(Post post){
            return PostListResponseDTO.builder().index(post.getIndex()).title(post.getTitle()).thumbnailUrl(post.getThumbnailUrl())
                    .createdAt(post.getCreatedAt()).postTag(post.getPostTag().stream().map(PostTagDTO::from).toList()).updatedAt(post.getUpdatedAt()).build();
        }
    }
