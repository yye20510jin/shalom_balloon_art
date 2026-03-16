package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.login.AccessTokenWithRoles;
import com.shalom.shalom_balloon_art.dto.login.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.login.MembershipRequestDTO;
import com.shalom.shalom_balloon_art.dto.login.FindIdDTO;
import com.shalom.shalom_balloon_art.entity.User.Role;
import com.shalom.shalom_balloon_art.entity.User.SignupRequest;
import com.shalom.shalom_balloon_art.entity.User.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.SignupRequestRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.*;

@Transactional
@Service
public class AuthService {
    private final UserEncryptService userEncryptService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CoustomUserDetailsService coustomUserDetailsService;
    private final SignupRequestRepository signupRequestRepository;

    public AuthService(JwtTokenProvider jwtTokenProvider,UserEncryptService userEncryptService,
                       CoustomUserDetailsService coustomUserDetailsService,UserRepository userRepository, SignupRequestRepository signupRequestRepository){
        this.jwtTokenProvider = jwtTokenProvider;
        this.coustomUserDetailsService = coustomUserDetailsService;
        this.userRepository = userRepository;
        this.userEncryptService = userEncryptService;
        this.signupRequestRepository = signupRequestRepository;
    }

    //회원가입
    public SignupRequest signupRequest(MembershipRequestDTO m){
        String pw = userEncryptService.signup(m.getUserPassword());
        SignupRequest s = SignupRequest.builder().userId(m.getUserId()).userPassword(pw).username(m.getUserName()).userPhoneNumber(m.getUserPhoneNumber()).build();
        return signupRequestRepository.save(s);
    }



    //admin 로그인
    public AccessTokenWithRoles adminLogin(LoginRequestDTO l){
            //id 조회
            User u;
            u = userRepository.findByUserId(l.getUserId()).orElseThrow(()->new BusinessException(CREDENTIALS_INVALID,""));

            userEncryptService.pwDecrypt(u.getUserId(),l.getPassword());

            UserDetails userdetails= coustomUserDetailsService.loadUserByUsername(l.getUserId());

            List<String> listRoles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            for(String role : listRoles){
                if(role.contains("USER")) throw new BusinessException(CREDENTIALS_INVALID,"");
            }

            return jwtTokenProvider.generateToken(userdetails);
    }

    //user 로그인
    public AccessTokenWithRoles userLogin(LoginRequestDTO l){
        //id 조회
        User u;
        u = userRepository.findByUserId(l.getUserId()).orElseThrow(()->new BusinessException(CREDENTIALS_INVALID,""));
        userEncryptService.pwDecrypt(u.getUserId(),l.getPassword());
        UserDetails userdetails = coustomUserDetailsService.loadUserByUsername(l.getUserId());

        List<String> listRoles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        for(String role : listRoles){
            if(role.contains("ADMIN")) throw new BusinessException(CREDENTIALS_INVALID,"");
        }

        return jwtTokenProvider.generateToken(userdetails);
    }

    //아이디 중복 체크
    public void idDuplicateCheck(String id){
        boolean existsInUser = userRepository.existsByUserId(id);
        boolean existsInSignupRequest = signupRequestRepository.existsByUserId(id);

        if(existsInUser || existsInSignupRequest){
            throw new BusinessException(USER_ALREADY_EXISTS,"");}
    }

    //아이디 찾기
    public String findId(FindIdDTO f){
        boolean chk = userRepository.existsByUsernameAndUserPhoneNumber(f.getUserName(), f.getUserPhoneNumber());
        if(!chk) throw new BusinessException(FIND_ID_NO_MATCH,"");
        return userRepository.findUserIdByUsernameAndUserPhoneNumber(f.getUserName(), f.getUserPhoneNumber());
    }


    }
