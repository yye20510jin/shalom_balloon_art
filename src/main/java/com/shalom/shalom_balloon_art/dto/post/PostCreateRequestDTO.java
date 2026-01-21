package com.shalom.shalom_balloon_art.dto.post;

import com.shalom.shalom_balloon_art.entity.post.Tags;
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
    private Long index;
    private String title;
    private String contentHtml;
    private String thumbnailUrl;
    private List<String> postTag;
    private String supplies;
    // getter/setter
}