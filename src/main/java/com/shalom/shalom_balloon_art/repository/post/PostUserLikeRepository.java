package com.shalom.shalom_balloon_art.repository.post;

import com.shalom.shalom_balloon_art.entity.post.PostUserLike;
import com.shalom.shalom_balloon_art.entity.post.PostUserLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostUserLikeRepository extends JpaRepository<PostUserLike, PostUserLikeId> {
    Optional<PostUserLike> findByIdPostIndexAndIdUserIndex(Long postIndex, Long userIndex);
    void deleteByIdPostIndexAndIdUserIndex(Long postIndex, Long userIndex);
    boolean existsByIdPostIndexAndIdUserIndex(Long postIndex, Long userIndex);

    @Query("""
            SELECT p.id.postIndex
            FROM PostUserLike p
            WHERE p.id.userIndex = :userIndex
            """)
    List<Long> findLikedPostIds(@Param("userIndex") Long userIndex);

}
