package com.shalom.shalom_balloon_art.repository.post;

import com.shalom.shalom_balloon_art.entity.post.PostViewUser;
import com.shalom.shalom_balloon_art.entity.post.PostViewUserId;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostViewUserRepository extends JpaRepository<PostViewUser, PostViewUserId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT pvu
        FROM PostViewUser pvu
        WHERE pvu.id.postIndex = :postIndex
            AND pvu.id.userIndex = :userIndex
        """)
    Optional<PostViewUser> findForUpdate(@Param("postIndex") Long postIndex, @Param("userIndex") Long userIndex);
}
