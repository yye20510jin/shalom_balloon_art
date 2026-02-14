package com.shalom.shalom_balloon_art.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.security.Key;
import java.util.List;

@Component
public class JwtTokenProvider {
    private final Key key;
    private final long expirationMs;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-ms}") long expirationMs){
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    //토큰생성
    //User(user.getUserId(), user.getUserPassword(), authorities);
    public String generateToken(UserDetails userdetails){
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        //Role 추가
        //getAuthority() -> SimpleGrantedAuthority 안에 있는 권한 문자열을 꺼내는 메서드
        List<String> roles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        return Jwts.builder().setSubject(userdetails.getUsername()).claim("roles",roles).setIssuedAt(now).setExpiration(expiry).signWith(key).compact();
    }

    //토큰에서 userId 추출
    public String getUserId(String token){
        return parseClaims(token).getBody().getSubject();
    }

    private Jws<Claims> parseClaims(String token){
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    //토큰 유효성 검사
    public TokenStatus validateToken(String token){
        return validateDetailed(token);
    }

    public TokenStatus validateDetailed(String token) {
        try {
            parseClaims(token);
            return TokenStatus.VALID;
        } catch (ExpiredJwtException e) {
            return TokenStatus.EXPIRED;
        } catch (SecurityException | SignatureException e) { // SignatureException은 jjwt 패키지
            return TokenStatus.INVALID_SIGNATURE;
        } catch (MalformedJwtException e) {
            return TokenStatus.MALFORMED;
        } catch (UnsupportedJwtException e) {
            return TokenStatus.UNSUPPORTED;
        } catch (IllegalArgumentException e) {
            return TokenStatus.EMPTY_OR_ILLEGAL;
        }
    }
}
