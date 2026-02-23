package com.shalom.shalom_balloon_art.global.error;

import com.shalom.shalom_balloon_art.config.RequestIdFilter;
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
    private String reqeustId;
    private String detail;
    public static ErrorResponse from(ErrorCode errorCode, HttpServletRequest req, String detail){
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                errorCode.getStatus(),
                OffsetDateTime.now(ZoneId.of("Asia/Seoul")).toString(),
                req.getRequestURI(),
                (String)req.getAttribute(RequestIdFilter.ATTR),
                detail
        );
    }
}
