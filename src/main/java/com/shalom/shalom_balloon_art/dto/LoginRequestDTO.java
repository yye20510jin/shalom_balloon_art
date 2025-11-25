package com.shalom.shalom_balloon_art.dto;

import lombok.Data;
import lombok.ToString;

@Data
public class LoginRequestDTO {
    private String id;
    @ToString.Exclude
    private String password;
}
