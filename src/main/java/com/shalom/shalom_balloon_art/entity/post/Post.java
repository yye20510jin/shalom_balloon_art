package com.shalom.shalom_balloon_art.entity.post;

import com.shalom.shalom_balloon_art.dto.post.PostCreateRequestDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


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
        this.updatedAt = LocalDateTime.now();
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

    public void syncTags(List<Tags> newTags){
        Set<Long> newTagIds = newTags.stream().map(Tags::getTagIndex).collect(Collectors.toSet());
        Iterator<PostTag> iterator = this.postTags.iterator();

        //newTags에 없는 태그 제거 (반복문에서 제거가 이뤄지기 때문에 iterator 사용)
        while(iterator.hasNext()){
            PostTag postTag = iterator.next();
            Long currentTagId = postTag.getTag().getTagIndex();

            if(!newTagIds.contains(currentTagId)){
                iterator.remove();
                postTag.getTag().getPostTags().remove(postTag);
            }
        }

        Set<Long> currentTagIds = this.postTags.stream().map(pt -> pt.getTag().getTagIndex()).collect(Collectors.toSet());

        //새로운 태그 저장
        for(Tags tag : newTags){
            if(!currentTagIds.contains(tag.getTagIndex())){
                PostTag.of(this,tag);
            }
        }
    }

    public static Post from(PostCreateRequestDTO p){
        return builder().title(p.getTitle()).contentHtml(p.getContentHtml()).thumbnailUrl(p.getThumbnailUrl()).supplies(p.getSupplies()).build();
    }
}
