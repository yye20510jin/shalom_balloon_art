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
@EqualsAndHashCode //JPA가 엔티티를 식별자 기준으로 캐싱/비교하기 때문에 복합키는 반드시 동등성 비교가 정확해야 한다.
public class PostDailyViewId implements Serializable {
    @Column(name="post_index",nullable = false)
    private Long postIndex;

    @Column(name="view_date", nullable = false)
    private LocalDate viewDate;
}
