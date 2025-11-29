package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.MembershipDTO;
import com.shalom.shalom_balloon_art.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("http://localhost:5173")
public class AdminController {
    private final AuthService authService;

    public AdminController(AuthService authService){
        this.authService = authService;
    }

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminTest(){
        System.out.println("test 메서드 안");
        return ResponseEntity.ok("관리자 전용 대시보드");
    }

    @PostMapping("/addAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addAdmin(@RequestBody MembershipDTO m){
        System.out.println("----addAdmin 안----");
        if(!authService.membership(m,"admin")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","회원가입 실패"));
        }
        return ResponseEntity.ok("success");
    }
}
