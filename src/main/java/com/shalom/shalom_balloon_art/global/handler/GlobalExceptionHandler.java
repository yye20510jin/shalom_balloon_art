package com.shalom.shalom_balloon_art.global.handler;

import com.shalom.shalom_balloon_art.auth.logger.ServerErrorLogger;
import com.shalom.shalom_balloon_art.config.RequestIdFilter;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.global.error.ErrorCode;
import com.shalom.shalom_balloon_art.global.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final ServerErrorLogger serverErrorLogger;

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest req){
        
        ErrorCode errorCode = e.getErrorCode();
        if (errorCode.getStatus().is5xxServerError()) {
            serverErrorLogger.error(req, errorCode, e);
        }
        return ResponseEntity.status(errorCode.getStatus()).body(ErrorResponse.from(errorCode,req, e.getDetail()));
    }
}
