package com.shalom.shalom_balloon_art.dto.post;

import com.shalom.shalom_balloon_art.entity.post.Tags;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PostTagDTO {
    Long tagIndex;
    String tagName;

    public static PostTagDTO from(Tags t){
        return PostTagDTO.builder().tagIndex(t.getTagIndex()).tagName(t.getTagName()).build();
    }

}
