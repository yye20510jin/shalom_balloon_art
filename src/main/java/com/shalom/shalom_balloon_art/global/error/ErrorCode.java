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
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "C003", "리소스를 찾을 수 없음"),

    //===Auth===
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001","인증이 필요합니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "A002", "접근 권한이 없습니다."),
    AUTH_NOT_FOUND(HttpStatus.NOT_FOUND, "A006", "해당 권한 없음"),

    //===User===
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    DUPLICATE_ID(HttpStatus.CONFLICT, "U002", "이미 사용 중인 아아디입니다."),
    USER_SAVE_FALSE(HttpStatus.INTERNAL_SERVER_ERROR, "U005", "사용자 해당 권한 없음 실패"),

    // ===Post===
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "P001", "게시글이 존재하지 않습니다."),

    //===Tag===
    TAG_NOT_SAVE(HttpStatus.CONFLICT, "T005", "태그 저장 실패"),
    DUPLICATE_TagName(HttpStatus.CONFLICT, "T003", "이미 존재하는 태그"),
    TAG_NAME_REQUIRED(HttpStatus.BAD_REQUEST,"T001", "빈 태그 이름"),
    TAG_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "T006" , "태그 조회 실패"),

    //===RESET TOKEN===
    INVALID_RESET_TOKEN(HttpStatus.FORBIDDEN, "R001","토큰 검증 실패"),
    EXPIRED_RESET_TOKEN(HttpStatus.UNAUTHORIZED, "R002", "토큰 만료");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
