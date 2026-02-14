package com.shalom.shalom_balloon_art.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Base64;
import java.util.Set;

@Service
public class RedisRefreshTokenStore {
    private final StringRedisTemplate redis;
    @Value("${jwt.refresh-ttl}")
    private final Duration REFRESH_TTL;

    public RedisRefreshTokenStore(StringRedisTemplate redis, @Value("${jwt.refresh-ttl}")Duration refreshTtl) {
        this.redis = redis;
        REFRESH_TTL = refreshTtl;
    }

    private String rtKey(String hash) { return "rt:" + hash; }          // refresh 단일 키
    private String userKey(String userId) { return "rtu:" + userId; }// 유저별 refresh 목록(Set)
    private String usedKey(String hash){ return "rte:" + hash;}

    public String hash(String rawToken) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    /** refresh 등록 */
    public void save(String userId, String refreshRaw, Duration ttl) {
        String h = hash(refreshRaw);
        redis.opsForValue().set(rtKey(h), String.valueOf(userId), ttl);
        redis.opsForSet().add(userKey(userId), h);
        redis.expire(userKey(userId), ttl);
    }

    /** refresh가 현재 "살아있는지" */
    public boolean exists(String refreshRaw) {
        String h = hash(refreshRaw);
        return Boolean.TRUE.equals(redis.hasKey(rtKey(h)));
    }

    /** refresh 1개 폐기(회전) */
    public void revokeOne(String userId, String refreshRaw) {
        String h = hash(refreshRaw);
        redis.delete(rtKey(h));
        redis.opsForSet().remove(userKey(userId), h);
    }

    /** userId남기기 */
    public void saveUsedToken(String userId, String refreshRaw) {
        String h = hash(refreshRaw);
        redis.opsForValue().set(usedKey(h), String.valueOf(userId), REFRESH_TTL);
    }

    /** Redis에서 UserId 가져오기*/
    public String findUserIdByRefresh(String refreshRaw){
        String h = hash(refreshRaw);
        return redis.opsForValue().get(rtKey(h));
    }

    /** Redis에서 만료 refresh의 userId 가져오기 */
    public String findReusedUserId(String refreshRaw){
        String h = hash(refreshRaw);
        return redis.opsForValue().get(usedKey(h));
    }

    /** 유저 전체 폐기(강제 로그아웃) */
    public void revokeAll(String userId) {
        Set<String> hashes = redis.opsForSet().members(userKey(userId));
        if (hashes != null) {
            for (String h : hashes) redis.delete(rtKey(h));
        }
        redis.delete(userKey(userId));
    }
}
