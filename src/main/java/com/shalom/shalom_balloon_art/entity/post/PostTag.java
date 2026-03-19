package com.shalom.shalom_balloon_art.entity.post;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name="post_tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostTag {

    @EmbeddedId
    private PostTagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postIndex")
    @JoinColumn(name="post_index", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("tagIndex")
    @JoinColumn(name="tag_index", nullable = false)
    private Tags tag;

    public static PostTag of(Post post, Tags tag){
        PostTag postTag = new PostTag();
        postTag.post = post;
        postTag.tag = tag;
        postTag.id = new PostTagId(post.getIndex(), tag.getTagIndex());

        post.getPostTags().add(postTag);
        tag.getPostTags().add(postTag);

        return postTag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostTag)) return false;
        PostTag that = (PostTag) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
