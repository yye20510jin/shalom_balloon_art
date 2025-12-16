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

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentHtml; // 글 내용

    @Column(nullable = false)
    private String thumbnailUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String contentHtml , String thumbnailUrl) {
        this.title = title;
        this.contentHtml = contentHtml;
        this.thumbnailUrl = thumbnailUrl;
    }
}
