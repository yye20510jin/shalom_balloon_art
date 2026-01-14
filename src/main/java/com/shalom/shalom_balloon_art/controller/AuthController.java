package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.LoginResponseDTO;
import com.shalom.shalom_balloon_art.dto.MembershipRequestDTO;
import com.shalom.shalom_balloon_art.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> membership(@RequestBody MembershipRequestDTO m){
        if(authService.signupRequest(m) == null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","회원가입에 실패했습니다."));
        }
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/idDuplicateCheck")
    public ResponseEntity<?> idDuplicateCheck(@RequestBody MembershipRequestDTO m){
        try{
            authService.idDuplicateCheck(m.getUserId());
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 아이디입니다.");
        }
        return ResponseEntity.ok("사용 가능한 아이디입니다.");
    }
}
