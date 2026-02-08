package com.shalom.shalom_balloon_art.auth.jwt;

import jakarta.servlet.http.HttpServletRequest;

public class RequestFingerprint {

    public static String ip(HttpServletRequest req){
        String xff = req.getHeader("X-Forwarded-For");
        if(xff != null && !xff.isBlank()){
            return xff.split(",")[0].trim();
        }
        String xrip = req.getHeader("X-Real-IP");
        if(xrip != null && !xrip.isBlank()){
            return xrip.trim();
        }
        return req.getRemoteAddr();
    }

    public static String ua(HttpServletRequest req){
        String ua = req.getHeader("User-Agent");
        return (ua == null) ? "-" : ua;
    }

    public static String path(HttpServletRequest req){
        return req.getMethod() + " " + req.getRequestURI();
    }
}
