package com.shalom.shalom_balloon_art.repository.post;

import com.shalom.shalom_balloon_art.entity.post.PostTag;
import com.shalom.shalom_balloon_art.entity.post.PostTagId;
import com.shalom.shalom_balloon_art.entity.post.Tags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    @Query("""
       SELECT t
       FROM PostTag pt
       JOIN pt.tag t
       WHERE pt.post.index = :postIndex
       """)
    List<Tags> findTagsByPostIndex(@Param("postIndex") Long postIndex);
}
