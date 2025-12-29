package com.shalom.shalom_balloon_art.dto;

import com.shalom.shalom_balloon_art.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostImageDTO {
    Long index;
    String url;

    public static PostImageDTO from (Post post){
        PostImageDTO p = new PostImageDTO();
        p.setIndex(post.getIndex());
        p.setUrl(post.getThumbnailUrl());
        return p;
    }
}
