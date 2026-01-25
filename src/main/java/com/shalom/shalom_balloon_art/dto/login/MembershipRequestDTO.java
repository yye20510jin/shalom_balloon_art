package com.shalom.shalom_balloon_art.dto.login;

import lombok.*;

@Getter
@NoArgsConstructor
public class MembershipRequestDTO {
    private String userId;
    private String userPassword;
    private String userName;
    private String userPhoneNumber;
}
