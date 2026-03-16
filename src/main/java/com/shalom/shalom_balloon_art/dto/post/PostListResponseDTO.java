package com.shalom.shalom_balloon_art.dto.post;

import com.shalom.shalom_balloon_art.entity.post.Post;
import com.shalom.shalom_balloon_art.entity.post.PostTag;
import lombok.*;
import org.jsoup.Jsoup;

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
        private boolean postLike;
        private List<PostTagDTO> postTag;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static PostListResponseDTO from (Post post, List<PostTagDTO> pt , boolean postLike){

            String html = post.getContentHtml();
            int maxLen = 160;
            String makePreview = "";
            if(!(html == null) && !(html.isBlank())){
                String text = Jsoup.parse(html).text();
                text = text.replaceAll("\\s+"," ").trim();
                makePreview = text.length() <= maxLen ? text : text.substring(0,maxLen);
            }

            return PostListResponseDTO.builder()
                    .index(post.getIndex())
                    .title(post.getTitle())
                    .thumbnailUrl(post.getThumbnailUrl())
                    .preview(makePreview)
                    .postLike(postLike)
                    .postTag(pt)
                    .supplies(post.getSupplies())
                    .createdAt(post.getCreatedAt())
                    .updatedAt(post.getUpdatedAt())
                    .build();
        }

    }
