package com.shalom.shalom_balloon_art.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MembershipResponseDTO {
    private Long userIndex;
    private String userName;
    private String userPhoneNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
