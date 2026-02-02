package com.shalom.shalom_balloon_art.repository.post;

import com.shalom.shalom_balloon_art.dto.post.PostSearchCond;
import com.shalom.shalom_balloon_art.dto.post.PostTagDTO;
import com.shalom.shalom_balloon_art.entity.post.Post;
import com.shalom.shalom_balloon_art.entity.post.Tags;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom {

    Page<Post> findAll(Pageable pageable);

    @Query("""
            SELECT p
            FROM Post p
            WHERE p.index IN :postIndex
            """)
    Page<Post> findByIds(@Param("postIndex") List<Long> index, Pageable pageable);

    public Page<Post> search(PostSearchCond cond, Pageable pageable);

    Page<Post> similarSearch(List<Long> tagIndex, Pageable pageable);

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

    @Query("""
            SELECT p.postTag
            FROM Post p
            WHERE p.index IN :postIndex
            """)
    List<Tags> findPostTagById(Long postIndex);
}
