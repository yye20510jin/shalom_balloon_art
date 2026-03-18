package com.shalom.shalom_balloon_art.entity.post;

import com.shalom.shalom_balloon_art.dto.post.PostCreateRequestDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_index")
    private Long index; // PK

    @Column(nullable = false, length = 200)
    private String title; // 글 제목

    private String contentHtml; // 글 내용

    @Column(nullable = false)
    private String thumbnailUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    @Builder.Default
    private Long views = 0L;

    @OneToMany(mappedBy="post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<PostTag> postTags = new HashSet<>();

    // orphanRemoval : 연관관계 제거 = 자식 제거
    // cascade , orphanRemoval은 One 쪽에서 설정
    // FK는 PostUserLike 쪽에서 관리.
    @OneToMany(mappedBy="post")
    private Set<PostUserLike> postUserLikes = new HashSet<>();

    @Column
    private String supplies;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String contentHtml, String supplies ) {
        this.title = title;
        this.contentHtml = contentHtml;
        this.supplies = supplies;
        onUpdate();
    }

    public void clearPostTags(){
        for(PostTag postTag : new HashSet<>(postTags)){
            postTag.unlink();
        }
    }

    public static Post from(PostCreateRequestDTO p){
        return builder().title(p.getTitle()).contentHtml(p.getContentHtml()).thumbnailUrl(p.getThumbnailUrl()).supplies(p.getSupplies()).build();
    }
}
