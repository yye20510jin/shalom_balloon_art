package com.shalom.shalom_balloon_art.entity.post;

import com.shalom.shalom_balloon_art.entity.User.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="post_view_user")
public class PostViewUser {

    @EmbeddedId
    private PostViewUserId id;

    @MapsId("postIndex")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="post_index", nullable=false)
    private Post post;

    @MapsId("userIndex")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_index", nullable=false)
    private User user;

    @Column(name="last_viewed_at", nullable=false)
    private LocalDateTime lastViewedAt;

    public void updateLastViewedAt(LocalDateTime time){
        this.lastViewedAt = time;
    }

    public PostViewUser(Post post, User user){
        this.post = post;
        this.user = user;
        this.id = new PostViewUserId(post.getIndex(),user.getUserIndex());
    }
}
