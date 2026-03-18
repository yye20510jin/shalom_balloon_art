package com.shalom.shalom_balloon_art.service.auth;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.login.AccessTokenWithRoles;
import com.shalom.shalom_balloon_art.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;

@Service
public class RefreshService {
    private final JwtTokenProvider jwt;
    private final RedisRefreshTokenStore store;
    //자동 Bean 등록 안 됨.
    private final SecureRandom secureRandom = new SecureRandom();
    private final CustomUserDetailsService customUserDetailsService;
    private final Duration REFRESH_TTL;

    public RefreshService(JwtTokenProvider jwt, RedisRefreshTokenStore store, CustomUserDetailsService customUserDetailsService, @Value("${jwt.refresh-ttl}")Duration refreshTtl) {
        this.jwt = jwt;
        this.store = store;
        this.customUserDetailsService = customUserDetailsService;
        REFRESH_TTL = refreshTtl;
    }


    public TokenPair rotate(String refreshRaw) {

        //정상 토큰(rotation)
        if(store.exists(refreshRaw)){
            String userId = store.findUserIdByRefresh(refreshRaw);

            store.revokeOne(userId, refreshRaw);
            store.saveUsedToken(userId, refreshRaw);

            UserDetails ud = customUserDetailsService.loadUserByUsername(userId);
            AccessTokenWithRoles at = jwt.generateToken(ud);

            String newRefresh = createRefreshToken();
            store.save(userId, newRefresh, REFRESH_TTL);
            return new TokenPair(at, newRefresh, REFRESH_TTL);
        }

        String reusedUserId = store.findReusedUserId(refreshRaw);

        //재사용 공격
        if(reusedUserId != null && !reusedUserId.isBlank()){
            store.revokeAll(reusedUserId);
            throw new RuntimeException("REFRESH_REUSED");
        }

        //완전 위조
        throw new RuntimeException("REFRESH_INVALID");
    }

    public void logout(String refreshRaw){
        String userId = store.findUserIdByRefresh(refreshRaw);
        if(userId == null || userId.isBlank())return;
        store.revokeOne(userId,refreshRaw);
        store.saveUsedToken(userId, refreshRaw);
    }

    public String newRefreshToken(String userId){
        String random = createRefreshToken();
        store.save(userId, random, REFRESH_TTL);
        return random;
    }

    private String createRefreshToken() {
        byte[] random = new byte[32];      // 256bit
        secureRandom.nextBytes(random);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(random);
    }

    //중첩 record
    public record TokenPair(AccessTokenWithRoles at, String refreshToken, Duration refreshTtl) {}
}

