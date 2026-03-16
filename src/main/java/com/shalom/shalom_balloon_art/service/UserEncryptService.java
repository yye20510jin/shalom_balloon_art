package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.entity.User.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.*;

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

    private String getUserPassword(String id){
        User u = userRepository.findByUserId(id).orElseThrow(()->new BusinessException(USER_NOT_FOUND,""));
        return u.getUserPassword();
    }

    //bcrypt 복호화 -> 비밀번호 확인
    public boolean pwDecrypt(String id, String inputPassword){
        if(!passwordEncoder.matches(inputPassword, getUserPassword(id))){
            throw new BusinessException(CREDENTIALS_INVALID,"");
        }else{
            return true;
        }
    }

    public boolean pwChkDecrypt(String id, String inputPassword){
        if(!passwordEncoder.matches(inputPassword, getUserPassword(id))){
            throw new BusinessException(USER_CREDENTIALS_INVALID,"");
        }else{
            return true;
        }
    }


}
