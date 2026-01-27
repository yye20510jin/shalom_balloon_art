package com.shalom.shalom_balloon_art.repository.post;

import com.shalom.shalom_balloon_art.dto.post.PostSearchCond;
import com.shalom.shalom_balloon_art.entity.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostRepositoryCustom {
    Page<Post> search(PostSearchCond cond, Pageable pageable);
}
