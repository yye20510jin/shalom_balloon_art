package com.shalom.shalom_balloon_art.auth.jwt;


public enum TokenStatus {
    //정상 토큰
    VALID,
    //만료됩
    EXPIRED,
    //서명이 위조/불일치
    INVALID_SIGNATURE,
    //형식이 깨진 토큰
    MALFORMED,
    //서버가 처리 못하는 JWT 형식
    UNSUPPORTED,
    //비어 있거나 아예 말이 안 되는 값
    EMPTY_OR_ILLEGAL
}
