package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.*;
import com.shalom.shalom_balloon_art.service.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:5173")
@RequiredArgsConstructor
public class MainController {
    private final UserEncryptService userEncryptService;

    //삭제예정
    @GetMapping("/")
    public void home(){
            System.out.println("/ 컨트롤러 안");
    }

    //삭제예정
    @GetMapping("/admin")
    public Map<String,Object> admin(){
        System.out.println("/admin 컨트롤러 안");
        return Map.of("success",true,"message","React에서/api/admin 호출 성공");
    }

    //삭제예정
    @PostMapping("/adminLogin")
    public String adminLogin(@RequestBody LoginRequestDTO loginDTO, HttpSession session){

        // 비밀번호 확인하는 로직 불러오기
        if(!userEncryptService.loginAdmin(loginDTO.getId(), loginDTO.getPassword())) return"false";
        session.setAttribute("adminId",loginDTO.getId());
        return"redirect:/";
    }

}
