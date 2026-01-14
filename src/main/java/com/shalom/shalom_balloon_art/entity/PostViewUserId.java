package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode
public class PostViewUserId implements Serializable {

    @Column(name ="post_index", nullable=false)
    private Long postIndex;

    @Column(name="user_index", nullable=false)
    private Long userIndex;
}
