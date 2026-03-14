package com.shalom.shalom_balloon_art.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    //=== Common ===
    INVALID_REQUEST(HttpStatus.BAD_REQUEST,"INVALID_REQUEST","잘못된 요청입니다."),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", "요청한 데이터를 찾을 수 없습니다."),

    //===Auth *===
    AUTH_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH_UNAUTHORIZED","로그인이 필요합니다."),
    AUTH_FORBIDDEN(HttpStatus.FORBIDDEN, "AUTH_FORBIDDEN", "접근 권한이 없습니다."),

    //===User===
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "해당 사용자를 찾을 수 없습니다."),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "USER_NOT_APPROVED", "사용 중인 아이디입니다."),
    USER_NOT_APPROVED(HttpStatus.FORBIDDEN, "USER_NOT_APPROVED", "승인 대기 중 입니다"),
    CREDENTIALS_INVALID(HttpStatus.UNAUTHORIZED, "CREDENTIALS_INVALID","아이디 또는 비밀번호가 올바르지 않습니다."),
    FIND_ID_NO_MATCH(HttpStatus.NOT_FOUND,"FIND_ID_NO_MATCH","입력하신 정보와 일치하는 계정이 없습니다."),
    USER_CREDENTIALS_INVALID(HttpStatus.UNAUTHORIZED, "USER_CREDENTIALS_INVALID","비밀번호가 일치하지 않습니다."),

    // ===Post===
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "게시글이 존재하지 않습니다."),

    //===Tag===
    TAG_INVALID(HttpStatus.BAD_REQUEST,"TAG_INVALID", "태그 형식이 올바르지 않습니다."),

    //===RESET TOKEN===
    INVALID_RESET_TOKEN(HttpStatus.FORBIDDEN, "INVALID_RESET_TOKEN","올바르지 않은 토큰입니다. "),
    EXPIRED_RESET_TOKEN(HttpStatus.UNAUTHORIZED, "EXPIRED_RESET_TOKEN", "토큰 만료"),

    // === SERVER ===
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR","서버 오류가 발생했습니다."),
    EXTERNAL_SERVICE_ERROR(HttpStatus.SERVICE_UNAVAILABLE,"EXTERNAL_SERVICE_ERROR","외부 서비스 오류가 발생했습니다."),
    SERVICE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE,"SERVICE_UNAVAILABLE","일시적으로 이용할 수 없습니다"),
    ROLE_NOT_CONFIGURED(HttpStatus.INTERNAL_SERVER_ERROR,"ROLE_NOT_CONFIGURED","필수 권한이 설정되지 않았습니다"),

    // === HOMECARD ===
    HOME_CARD_NOT_FOUND(HttpStatus.NOT_FOUND,"HOME_CARD_NOT_FOUND","홈카드를 찾을 수 없습니다."),
    HOME_CARD_LIMIT_EXCEEDED(HttpStatus.CONFLICT,"HOME_CARD_LIMIT_EXCEEDED","홈카드는 정해진 개수만 가능합니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
