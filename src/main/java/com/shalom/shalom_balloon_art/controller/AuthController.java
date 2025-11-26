package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.LoginResponseDTO;
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
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequestDTO loginRequestDTO){
        Map<String,Object> result;
        try{
            result = authService.AdminLogin(loginRequestDTO);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호 오류");
        }
        List<String> roles = ((List<?>)result.get("roles")).stream().map(String::valueOf).toList();
        //return Jwts.builder().setSubject(userdetails.getUsername()).claim("roles",roles).setIssuedAt(now).setExpiration(expiry).signWith(key).compact();
        return ResponseEntity.ok(new LoginResponseDTO((String)result.get("token"),(String)result.get("userId"),roles));
    }

    @GetMapping("/")
    public ResponseEntity<?> home(){
        return ResponseEntity.ok("success");
    }

/*    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("wrong password");*/
}
