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
public class PostResponseDTO {

    private Long index;
    private String title;
    private String contentHtml;
    private String thumbnailUrl;
    private String supplies;
    private boolean postLike;
    private List<PostTagDTO> postTags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponseDTO from(Post post,List<PostTagDTO> pt,boolean postLike){
        return PostResponseDTO.builder()
                .index(post.getIndex())
                .title(post.getTitle())
                .contentHtml(post.getContentHtml())
                .thumbnailUrl(post.getThumbnailUrl())
                .supplies(post.getSupplies())
                .postLike(postLike)
                .postTags(pt)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

}