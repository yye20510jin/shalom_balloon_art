package com.shalom.shalom_balloon_art.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    //=== Common ===
    INVALID_REQUEST(HttpStatus.BAD_REQUEST,"C001","잘못된 요청입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"C002", "접근 권한이 없습니다."),

    //===Auth===
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001","인증이 필요합니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "A002", "접근 권한이 없습니다."),

    //===User===
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "U002", "이미 사용 중인 이메일입니다."),

    // ===Post===
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "게시글이 존재하지 않습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
