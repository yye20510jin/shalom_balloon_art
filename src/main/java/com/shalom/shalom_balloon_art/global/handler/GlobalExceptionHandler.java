package com.shalom.shalom_balloon_art.global.handler;

import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.global.error.ErrorCode;
import com.shalom.shalom_balloon_art.global.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest req){
        
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity.status(errorCode.getStatus()).body(ErrorResponse.from(errorCode,req, e.getDetail()));
    }

    //sql save
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDb(DataIntegrityViolationException e, HttpServletRequest req){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("DB_CONSTRAINT", "데이터 제약 조건 위반",HttpStatus.CONFLICT, OffsetDateTime.now(ZoneId.of("Asia/Seoul")).toString(), req.getRequestURI(),""));
    }

}
