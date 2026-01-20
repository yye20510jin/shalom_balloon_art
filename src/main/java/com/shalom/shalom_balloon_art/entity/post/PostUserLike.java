package com.shalom.shalom_balloon_art.entity.post;

import com.shalom.shalom_balloon_art.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PostUserLike {

    @EmbeddedId
    private PostUserLikeId id;

    @MapsId("postIndex")
    @ManyToOne(fetch = FetchType.LAZY)
    private Post post;

    @MapsId("userIndex")
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public static PostUserLike of(Post post, User user){
        PostUserLike pul = new PostUserLike();
        pul.post = post;
        pul.user = user;
        pul.id = new PostUserLikeId(post.getIndex(),user.getUserIndex());
        return pul;
     }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostUserLike)) return false;
        PostUserLike that = (PostUserLike) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
