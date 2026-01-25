package com.shalom.shalom_balloon_art.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pw_reset_token", indexes = {
        @Index(name="idx_pw_reset_token_hash", columnList="tokenHash"),
        @Index(name="idx_pw_reset_user", columnList="userIndex")
})
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long pwResetIndex;

    @Getter
    private Long userIndex;

    @Column(nullable = false, length = 64)
    private String tokenHash;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private LocalDateTime usedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public boolean isExpired(LocalDateTime now){
        return now.isAfter(expiresAt);
    }

    public boolean isUsed(){
        return usedAt != null;
    }

    protected PasswordResetToken(){}

    public PasswordResetToken(Long userIndex, String tokenHash, LocalDateTime expiresAt){
        this.userIndex = userIndex;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }
}
