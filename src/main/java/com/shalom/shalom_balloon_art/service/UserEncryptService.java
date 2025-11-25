package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.entity.Role;
import com.shalom.shalom_balloon_art.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserEncryptService {

    //private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    //bcrypt로 암호화
    public String signup(String pw){
        return passwordEncoder.encode(pw);
    }

    //bcrypt 복호화 -> 비밀번호 확인
//    public boolean loginAdmin(String id, String inputPassword){
//        Optional<Role> optionalAdminEntity= adminRepository.findById(id);
//        if(optionalAdminEntity.isEmpty()) return false;
//        Role adminEntity = optionalAdminEntity.get();
//        String encodedPassword = adminEntity.getPassword();
//        // 같으면 true, 아니면 false 반환
//        return passwordEncoder.matches(inputPassword, encodedPassword);
//    }


}
