package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeCard {
    @Id
    @Column(name="hc_index")
    private Integer index;

    @Column(nullable = false)
    private String imgUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String text;

    public void update(String imgUrl, String text){
        this.imgUrl = imgUrl;
        this.text = text;
    }

}
