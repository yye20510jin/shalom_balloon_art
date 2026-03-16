package com.shalom.shalom_balloon_art.entity.post;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Builder
@Entity(name = "tags")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Tags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_index")
    private Long tagIndex;

    @Column(nullable = false, unique=true)
    private String tagName;

    @OneToMany(mappedBy="tag")
    @Builder.Default
    private Set<PostTag> postTags = new HashSet<>();

    public Tags(String tagName){
        this.tagName = tagName;
    }

    public static Tags from(String name){
        return Tags.builder().tagName(name).build();
    }
}
