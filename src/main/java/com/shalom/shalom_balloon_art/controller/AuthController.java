package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.LoginResponseDTO;
import com.shalom.shalom_balloon_art.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/adminLogin")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO){
        String token = authService.AdminLogin(loginRequestDTO);
        //return Jwts.builder().setSubject(userdetails.getUsername()).claim("roles",roles).setIssuedAt(now).setExpiration(expiry).signWith(key).compact();
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @GetMapping("/")
    public ResponseEntity<?> home(){
        return ResponseEntity.ok("success");
    }

/*    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("wrong password");*/
}
