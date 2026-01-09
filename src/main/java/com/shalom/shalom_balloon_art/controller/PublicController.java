package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.HomeCardResponseDTO;
import com.shalom.shalom_balloon_art.dto.PostListResponseDTO;
import com.shalom.shalom_balloon_art.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@CrossOrigin(origins="http://localhost:5173")
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class PublicController {

    private final AdminService adminService;

    // 메인 페이지
    @GetMapping
    public ResponseEntity<List<HomeCardResponseDTO>> home(){
        return ResponseEntity.ok(adminService.homeCard());
    }

}
