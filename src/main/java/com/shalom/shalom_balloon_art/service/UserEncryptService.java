package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserEncryptService {

    //private final UserRepository userRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //bcrypt로 암호화
    public String signup(String pw){
        return passwordEncoder.encode(pw);
    }

    //bcrypt 복호화 -> 비밀번호 확인
    public boolean pwDecrypt(String id, String inputPassword){
        User u = userRepository.findByUserId(id).orElseThrow(()->new RuntimeException(""));
        String encodedPassword = u.getUserPassword();
        // 같으면 true, 아니면 false 반환
        if(!passwordEncoder.matches(inputPassword, encodedPassword)){
            throw new RuntimeException("");
        }else{
            return true;
        }
    }


}
