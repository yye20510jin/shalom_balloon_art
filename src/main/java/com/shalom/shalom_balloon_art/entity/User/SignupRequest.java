package com.shalom.shalom_balloon_art.entity.User;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "signup_request")
@Getter
@Builder
public class SignupRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userIndex;          // PK

    @Column(length = 30, nullable = false, unique = true)
    private String userId;           // 아이디

    @Column(length = 255, nullable = false)
    private String userPassword;     // 비밀번호(암호화된 값)

    @Column(length = 30, nullable = false)
    private String username;         // 이름

    @Column(length = 30, nullable = false)
    private String userPhoneNumber;  // 전화번호

    @Column(nullable = false)
    @Setter
    private Integer authStatus = 0;  // 0: 미확인, 1: 인증, 2: 비인증

    @Column(updatable = false)
    private LocalDateTime createdAt; // 생성 시간

    private LocalDateTime updatedAt; // 수정 시간

    // ====== 생성/수정 시각 자동 세팅 ======
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.authStatus == null) {
            this.authStatus = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
