package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.*;
import com.shalom.shalom_balloon_art.service.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:5173")
@RequiredArgsConstructor
public class MainController {
    final UserEncryptService userEncryptService;

    @GetMapping("/")
    public void home(){
            System.out.println("/ 컨트롤러 안");
    }

    @GetMapping("/admin")
    public Map<String,Object> admin(){
        System.out.println("/admin 컨트롤러 안");
        return Map.of("success",true,"message","React에서/api/admin 호출 성공");
    }

    @PostMapping("/adminLogin")
    public String adminLogin(LoginDTO adminDTO, RedirectAttributes redirectAttributes, HttpSession session){

        // 비밀번호 확인하는 로직 불러오기
        if(!userEncryptService.loginAdmin(adminDTO.getId(), adminDTO.getPassword())){
            redirectAttributes.addFlashAttribute("errorMessage","아이디 또는 비밀번호가 일치하지 않습니다.");
            return"redirect:/admin";
        }

        session.setAttribute("adminId",adminDTO.getId());
        return"redirect:/";
    }

}
