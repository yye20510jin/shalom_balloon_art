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
//    postIndex, viewDate 01/12일의 1번 post
    private PostDailyViewId id;

//    식별자 관계 명시.
//    PK안에 들어있는 postId와 Post PK의 관계를 명시해 같은 컬럼으로 묶어주는 역할.
    @MapsId("postIndex")
//    기본값(EAGER)이면, daily view 행 하나를 읽을 때마다 Post를 즉시 가져오려한다.
//    LAZY를 사용하면 Post가 필요할 때만 추가로 조회 가능하다.
    @ManyToOne(fetch = FetchType.LAZY)
//    referencedColumnName을 따로 지정하지 않았기 때문에 상대 테이블 PK로 join 진행
    @JoinColumn(name="post_index", nullable=false)
//    Post 하나에 PostDailyView 여러 개
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
