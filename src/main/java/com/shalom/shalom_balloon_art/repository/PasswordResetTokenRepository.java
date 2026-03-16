package com.shalom.shalom_balloon_art.repository;

import com.shalom.shalom_balloon_art.entity.User.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findTopByTokenHashOrderByCreatedAtDesc(String tokenHash);

    @Modifying
    @Query("""
            DELETE FROM PasswordResetToken t
            WHERE t.expiresAt < :now OR t.usedAt IS NOT NULL
            """)
    int cleanup(@Param("now") LocalDateTime now);

    @Modifying
    @Query("""
            UPDATE PasswordResetToken t
            SET t.usedAt = :now
            WHERE t.pwResetIndex = :pwResetIndex
                AND t.usedAt IS NULL
                AND t.expiresAt > :now
            """)
    int markUsedIfValid(@Param("pwResetIndex") Long pwResetIndex, @Param("now") LocalDateTime now );

}
