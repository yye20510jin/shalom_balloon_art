package com.shalom.shalom_balloon_art.dto.login;

import lombok.Getter;

@Getter
public class ResetConfirmDTO {
    private String token;
    private String newPassword;
}
