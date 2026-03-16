package com.shalom.shalom_balloon_art.entity.post;

import com.shalom.shalom_balloon_art.entity.User.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity(name="post_user_like")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PostUserLike {

    @EmbeddedId // 복합키
    private PostUserLikeId id;

    @MapsId("postIndex") // FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="post_index", nullable = false)
    private Post post;

    @MapsId("userIndex")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_index", nullable = false)
    private User user;

    public static PostUserLike of(Post post, User user){
        //PostUserLike를 담은 post 객체를 PostUserLike에 추가한다.
        PostUserLike pul = new PostUserLike();
        pul.post = post;
        pul.user = user;
        pul.id = new PostUserLikeId(post.getIndex(),user.getUserIndex());

        post.getPostUserLikes().add(pul);
        user.getPostUserLikes().add(pul);
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
