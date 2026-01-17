package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.post.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tags, Long> {
    boolean existsByTagName(String tagName);
    Optional<Tags> findByTagName(String tagName);
}
