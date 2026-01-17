package com.shalom.shalom_balloon_art.entity.post;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Entity
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

    @Override
    public boolean equals(Object o){
        if(this == o) return true;
        if(!(o instanceof Tags)) return false;
        Tags t = (Tags) o;
        return tagName != null && tagName.equals(t.tagName);
    }

    @Override
    public int hashCode(){
        return tagName != null ? tagName.hashCode() : 0;
    }

    public Tags(String tagName){
        this.tagName = tagName;
    }

    public static Tags from(String name){
        return Tags.builder().tagName(name).build();
    }
}
