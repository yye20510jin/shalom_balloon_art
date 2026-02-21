package com.shalom.shalom_balloon_art.global.error;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Date;

@Getter
@AllArgsConstructor
public class ErrorResponse {
    private String code;
    private String message;
    private HttpStatus status;
    private String timestamp;
    private String path;
    private String detail;
    public static ErrorResponse from(ErrorCode errorCode, HttpServletRequest req, String detail){
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                errorCode.getStatus(),
                OffsetDateTime.now(ZoneId.of("Asia/Seoul")).toString(),
                req.getRequestURI(),
                detail
        );
    }
}
