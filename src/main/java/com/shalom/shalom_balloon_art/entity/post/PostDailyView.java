package com.shalom.shalom_balloon_art.entity.post;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="post_daily_view")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PostDailyView {

    @EmbeddedId
    private PostDailyViewId id;

    @MapsId("postIndex")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="post_index", nullable=false)
    private Post post;

    @Column(name="view_count", nullable=false)
    private int viewCount;

    public void increase(){
        this.viewCount++;
    }

    public void increase(int count){
        this.viewCount += count;
    }

    public PostDailyView(Post post){
        this.post = post;
    }
}
