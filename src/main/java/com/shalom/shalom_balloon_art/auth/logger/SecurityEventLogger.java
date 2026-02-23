package com.shalom.shalom_balloon_art.auth.logger;

import com.shalom.shalom_balloon_art.auth.jwt.RequestFingerprint;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SecurityEventLogger {

    private static final Logger log =
            LoggerFactory.getLogger("SECURITY_LOG");

    public void info(String eventType, HttpServletRequest req, Authentication auth, String msg){
        String user = (auth == null) ? "anonymous" : safeName(auth);
        log.info("[SECURITY] {} user={} ip={} ua=\"{}\" req=\"{}\" msg=\"{}\"",
                eventType,
                user,
                RequestFingerprint.ip(req),
                trim(RequestFingerprint.ua(req), 160),
                RequestFingerprint.path(req),
                trim(msg, 300)
        );
    }

    public void warn(String eventType, HttpServletRequest req, Authentication auth, String msg) {
        String user = (auth == null) ? "anonymous" : safeName(auth);
        log.warn("[SECURITY] {} user={} ip={} ua=\"{}\" req=\"{}\" msg=\"{}\"",
                eventType,
                user,
                RequestFingerprint.ip(req),
                trim(RequestFingerprint.ua(req), 160),
                RequestFingerprint.path(req),
                msg
        );
    }

    private String safeName(Authentication auth) {
        return trim(auth.getName(), 80);
    }

    private String trim(String s, int max) {
        if (s == null) return "-";
        if (s.length() <= max) return s;
        return s.substring(0, max) + "...";
    }
}
