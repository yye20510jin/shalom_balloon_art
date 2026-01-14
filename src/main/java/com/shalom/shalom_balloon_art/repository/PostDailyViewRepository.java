package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.PostDailyView;
import com.shalom.shalom_balloon_art.entity.PostDailyViewId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PostDailyViewRepository extends JpaRepository<PostDailyView, PostDailyViewId> {

    @Query("""
            SELECT pdv.id.postIndex, SUM(pdv.viewCount)
            FROM PostDailyView pdv
            WHERE pdv.id.viewDate BETWEEN :from AND :to
            GROUP BY pdv.id.postIndex
            ORDER BY SUM(pdv.viewCount) DESC

    """)
    List<Object[]> findTopPostIds(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            Pageable pageable
    );

    @Query("""
        SELECT pdv
        FROM PostDailyView  pdv
        WHERE pdv.id.viewDate BETWEEN :from AND :to
            AND pdv.id.postIndex IN :postIndex
        ORDER BY pdv.id.viewDate ASC
    """)
    List<PostDailyView> findDailyViews(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("postIndex") List<Long> postIndex
    );

    @Modifying
    @Query(value = """
        INSERT INTO post_daily_view(post_index, view_date, view_count)
        VALUES(:postIndex, :viewDate, 1)
        ON DUPLICATE KEY UPDATE view_count = view_count + 1
    """,nativeQuery=true)
    int upsertIncrease(@Param("postIndex") Long postIndex, @Param("viewDate") LocalDate viewDate);
}
