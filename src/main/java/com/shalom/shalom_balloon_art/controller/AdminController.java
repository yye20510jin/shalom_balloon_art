package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.MembershipRequestDTO;
import com.shalom.shalom_balloon_art.dto.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.entity.SignupRequest;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.service.AuthService;
import com.shalom.shalom_balloon_art.service.SignupRequestService;
import com.shalom.shalom_balloon_art.service.UserEncryptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("http://localhost:5173")
public class AdminController {
    private final AuthService authService;
    private final SignupRequestService signupRequestService;
    private final UserEncryptService userEncryptService;

    public AdminController(AuthService authService, SignupRequestService signupRequestService, UserEncryptService userEncryptService){
        this.authService = authService;
        this.signupRequestService = signupRequestService;
        this.userEncryptService = userEncryptService;
    }

    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminTest(){
        System.out.println("test 메서드 안");
        return ResponseEntity.ok("관리자 전용 대시보드");
    }

    @PostMapping("/addAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addAdmin(@RequestBody MembershipRequestDTO m){

        String pw = userEncryptService.signup(m.getUserPassword());
        User u = User.builder().userId(m.getUserId()).userPassword(pw).userPhoneNumber(m.getUserPhoneNumber()).username(m.getUserName()).build();
        if(!authService.membership(u,"admin")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","회원가입 실패"));
        }
        return ResponseEntity.ok("success");
    }

    @GetMapping("/userApprove")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MembershipResponseDTO>> userApprove(){
        return ResponseEntity.ok(signupRequestService.userApprove());
    }

    @PatchMapping("/rejectUser/{userIndex}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectUser(@PathVariable Long userIndex ){

        try{
            authService.rejectUser(userIndex);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("사용자 인증 거부 실패");
        }
        return ResponseEntity.ok("사용자 인증 거부 성공");
    }

    @PostMapping("/approveUser/{userIndex}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveUser(@PathVariable Long userIndex){
        try{
            authService.approveUser(userIndex);
        }catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("사용자 인증 요청 실패");
        }
        return ResponseEntity.ok("사용자 인증 요청 성공");
    }
}
