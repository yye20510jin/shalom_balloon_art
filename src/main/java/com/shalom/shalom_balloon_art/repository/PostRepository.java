package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAll(Pageable pageable);

    @Query("""
            SELECT p
            FROM Post p
            WHERE p.index IN :postIndex
            """)
    Page<Post> findByIds(@Param("postIndex") List<Long> index, Pageable pageable);

    Page<Post> findByTitleContainingIgnoreCase(String searchTitle,Pageable pageable);

    @Query("""
        SELECT p.index, p.title
        FROM Post p
        WHERE p.index IN :postIndex
    """)
    List<Object[]> findTitlesByIds(@Param("postIndex") List<Long> index);

    @Modifying
    @Query("""
        UPDATE Post p
        SET p.views = p.views + 1 
        WHERE p.index = :postIndex
    """)
    int incrementViews(@Param("postIndex") Long postIndex);
}
