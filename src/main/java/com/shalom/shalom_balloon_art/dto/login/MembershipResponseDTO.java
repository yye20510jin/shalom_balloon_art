package com.shalom.shalom_balloon_art.dto.login;

import com.shalom.shalom_balloon_art.entity.User.User;
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
    private int authStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MembershipResponseDTO from(User user){
        return MembershipResponseDTO.builder().userIndex(user.getUserIndex())
                .userName(user.getUsername()).userPhoneNumber(user.getUserPhoneNumber()).build();
    }
}
