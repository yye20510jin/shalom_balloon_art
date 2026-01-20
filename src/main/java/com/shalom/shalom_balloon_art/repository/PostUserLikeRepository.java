package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.post.PostUserLike;
import com.shalom.shalom_balloon_art.entity.post.PostUserLikeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostUserLikeRepository extends JpaRepository<PostUserLike, PostUserLikeId> {
    Optional<PostUserLike> findByIdPostIndexAndIdUserIndex(Long postIndex, Long userIndex);
    void deleteByIdPostIndexAndIdUserIndex(Long postIndex, Long userIndex);
    boolean existsByIdPostIndexAndIdUserIndex(Long postIndex, Long userIndex);
}
