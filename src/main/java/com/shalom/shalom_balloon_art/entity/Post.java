package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // 글 내용

    @OneToMany(
            mappedBy = "post",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<PostImage> images = new ArrayList<>(); // Firebase 다운로드 URL

    @Column(length = 500)
    private String youtubeUrl; // 유튜브 주소 (옵션)

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        System.out.println("-----현재시간 insert-----");
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addImage(String url){
        PostImage image = new PostImage(url,this);
        images.add(image);
        image.setPost(this);
        System.out.println("-------이미지 join ---------");
        System.out.println(url);
    }

    public void removeImage(PostImage image){
        images.remove(image);
        image.setPost(null);
    }
}
