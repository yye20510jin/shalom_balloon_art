package com.shalom.shalom_balloon_art.entity.post;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PostTagId implements Serializable {
    @Column(name="post_index")
    private Long postIndex;

    @Column(name="tag_index")
    private Long tagIndex;
}
