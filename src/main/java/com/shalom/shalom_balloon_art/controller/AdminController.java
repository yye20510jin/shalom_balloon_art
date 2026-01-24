package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.HomeCardRequestDTO;
import com.shalom.shalom_balloon_art.dto.MembershipRequestDTO;
import com.shalom.shalom_balloon_art.dto.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.AnalyticsResponseDTO;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.service.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("http://localhost:5173")
public class AdminController {
    private final AuthService authService;
    private final SignupRequestService signupRequestService;
    private final UserEncryptService userEncryptService;
    private final AdminService adminService;
    private final PostAnalyticsService postAnalyticsService;

    public AdminController(AuthService authService, SignupRequestService signupRequestService, UserEncryptService userEncryptService
            ,AdminService adminService,PostAnalyticsService postAnalyticsService){
        this.adminService = adminService;
        this.authService = authService;
        this.signupRequestService = signupRequestService;
        this.userEncryptService = userEncryptService;
        this.postAnalyticsService = postAnalyticsService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsResponseDTO> adminDashboard(){
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusMonths(1);
        int top = 5;

        return ResponseEntity.ok(postAnalyticsService.getTopViewedDaily(from,to,top));
    }

    //관리자 추가
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

    //유저 인증
    @GetMapping("/userApprove")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MembershipResponseDTO>> userApprove(@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "0") int auth){
        return ResponseEntity.ok(signupRequestService.userApprove(page,auth));
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

    //유저 인증
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

    @PostMapping("/userList")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<MembershipResponseDTO>> userList(@RequestBody int page){
        return ResponseEntity.ok(adminService.userList(page));
    }

    //HomeCard가져오기
    @GetMapping("/homeCard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> homeCard(){
        return ResponseEntity.ok(adminService.homeCard());
    }

    //HomeCard 수정
    @PostMapping("/homeCard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> homeCardEdit(@RequestBody HomeCardRequestDTO h){
        try{
            adminService.homeCardEdit(h);
        }catch(IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        return ResponseEntity.ok("homeCard 업데이트 성공");
    }
}
