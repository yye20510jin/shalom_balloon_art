package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.User.SignupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface SignupRequestRepository extends JpaRepository<SignupRequest, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM SignupRequest s " +
            "WHERE s.authStatus = 2 " + // 비인증 상태
            "AND s.updatedAt < :threshold")
    int deleteOldRejected(@Param("threshold") LocalDateTime threshold);

    @Modifying
    int deleteByUserIndex(Long userIndex);

    boolean existsByUserId(String userId);

}
