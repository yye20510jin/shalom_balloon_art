package com.shalom.shalom_balloon_art.controller;

import com.shalom.shalom_balloon_art.dto.*;
import com.shalom.shalom_balloon_art.service.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class MainController {
    final UserEncryptService userEncryptService;

    @GetMapping("/")
    public String home(){
        return "home";
    }

    @GetMapping("/admin")
    public String admin(Model model){
        model.addAttribute("loginDTO",new LoginDTO());
        return "admin";
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
