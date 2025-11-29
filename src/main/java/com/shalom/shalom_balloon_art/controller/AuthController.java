package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.LoginResponseDTO;
import com.shalom.shalom_balloon_art.dto.MembershipDTO;
import com.shalom.shalom_balloon_art.service.AuthService;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/adminLogin")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequestDTO l){
        Map<String,Object> result;
        try{
            result = authService.adminLogin(l);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","일치하는 아이디나 비밀번호가 없습니다."));
        }
        List<String> roles = ((List<?>)result.get("roles")).stream().map(String::valueOf).toList();
        //return Jwts.builder().setSubject(userdetails.getUsername()).claim("roles",roles).setIssuedAt(now).setExpiration(expiry).signWith(key).compact();
        return ResponseEntity.ok(new LoginResponseDTO((String)result.get("token"),(String)result.get("userId"),roles));
    }

    @PostMapping("/userLogin")
    public ResponseEntity<?> userLogin(@RequestBody LoginRequestDTO l){
        Map<String,Object> result;
        try{
            result = authService.userLogin(l);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","일치하는 아이디나 비밀번호가 없습니다."));
        }

        List<String> roles = ((List<?>)result.get("roles")).stream().map(String::valueOf).toList();
        return ResponseEntity.ok(new LoginResponseDTO((String)result.get("token"),(String)result.get("userId"),roles));
    }

    @PostMapping("/membership")
    public ResponseEntity<?> membership(@RequestBody MembershipDTO membershipDTO){
        if(!authService.membership(membershipDTO)){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","회원가입 실패"));
        }
        return ResponseEntity.ok("success");
    }
}
