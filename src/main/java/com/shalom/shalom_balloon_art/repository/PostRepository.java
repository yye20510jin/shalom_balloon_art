package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 필요하면 나중에 검색 메서드 추가 (title like %keyword% 이런 것들)
}
