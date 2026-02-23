package com.shalom.shalom_balloon_art.global.error;

import lombok.Getter;

import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Getter
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String detail;


    public BusinessException(ErrorCode errorCode, String detail){
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.detail = detail;
    }
}
