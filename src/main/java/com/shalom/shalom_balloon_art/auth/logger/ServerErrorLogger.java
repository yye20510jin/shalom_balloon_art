package com.shalom.shalom_balloon_art.auth.logger;

import com.shalom.shalom_balloon_art.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ServerErrorLogger {
    private final static Logger log = LoggerFactory.getLogger("SERVER_ERROR_LOG");

    public void error(HttpServletRequest req, ErrorCode code, Exception e){
        log.error("[SERVER_ERROR] {} {} code={}",
                req.getMethod(),
                req.getRequestURI(),
                code.name(),
                e
        );
    }
}
