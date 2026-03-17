package com.shalom.shalom_balloon_art.entity.post;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;


import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class PostDailyViewId implements Serializable {
    @Column(name="post_index",nullable = false)
    private Long postIndex;

    @Column(name="view_date", nullable = false)
    private LocalDate viewDate;
}
