package com.shalom.shalom_balloon_art.dto.login;

import lombok.Data;
import lombok.ToString;

@Data
public class LoginRequestDTO {
    private String userId;
    @ToString.Exclude
    private String password;
}
