package com.shalom.shalom_balloon_art.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MembershipDTO {
    private String userId;
    private String userPassword;
    private String userName;
    private String userPhoneNumber;
}
