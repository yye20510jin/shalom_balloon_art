package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;
    private final CoustomUserDetailsService coustomUserDetailsService;

    public AuthService(JwtTokenProvider jwtTokenProvider,CoustomUserDetailsService coustomUserDetailsService){
        this.jwtTokenProvider = jwtTokenProvider;
        this.coustomUserDetailsService = coustomUserDetailsService;
    }

    public String AdminLogin(LoginRequestDTO loginRequestDTO){
        //TODO : 나중에 DB에서 관리자 계정 조회 + 비밀번호(BCrypt) 검증 예정
        if("admin".equals(loginRequestDTO.getId()) && "1234".equals(loginRequestDTO.getPassword())){
            UserDetails userdetails =coustomUserDetailsService.loadUserByUsername(loginRequestDTO.getId());
            //User(user.getUserId(), user.getUserPassword(), authorities);
            return jwtTokenProvider.generateToken(userdetails);
        }

        //로그인 실패 시 예외 던지기
        throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

   /* public String UserLogin(LoginRequestDTO loginRequestDTO){

        //TODO : 나중에 DB에서 관리자 계정 조회 + 비밀번호(BCrypt) 검증 예정
        if(true){
            return jwtTokenProvider.generateToken(loginRequestDTO.getId());
        }

        //로그인 실패 시 예외 던지기
        throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
    }*/
}
