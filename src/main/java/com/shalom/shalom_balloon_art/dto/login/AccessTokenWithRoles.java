package com.shalom.shalom_balloon_art.dto.login;

import java.util.List;

public record AccessTokenWithRoles(
        String accessToken,
        String userId,
        List<String> roles
) {}