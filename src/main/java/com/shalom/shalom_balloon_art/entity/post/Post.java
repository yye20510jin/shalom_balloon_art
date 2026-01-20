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

    @Lob
    @Column(columnDefinition = "LONGTEXT")
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

    @ManyToMany
    @JoinTable(
            name = "post_tag",
            joinColumns = @JoinColumn(name = "post_index"),
            inverseJoinColumns = @JoinColumn(name = "tag_index")
    )
    @Builder.Default
    private Set<Tags> postTag = new HashSet<>();

    // orphanRemoval : 연관관계 제거 = 자식 제거
    @OneToMany(mappedBy="post")
    private Set<PostUserLike> postUserLikes = new HashSet<>();

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String contentHtml ) {
        this.title = title;
        this.contentHtml = contentHtml;
        onUpdate();
    }

    public static Post from(PostCreateRequestDTO p){
        return builder().title(p.getTitle()).contentHtml(p.getContentHtml()).thumbnailUrl(p.getThumbnailUrl()).build();
    }
}
