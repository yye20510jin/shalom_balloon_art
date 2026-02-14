package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.login.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.login.MembershipRequestDTO;
import com.shalom.shalom_balloon_art.dto.login.FindIdDTO;
import com.shalom.shalom_balloon_art.entity.Role;
import com.shalom.shalom_balloon_art.entity.SignupRequest;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.SignupRequestRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.*;

@Transactional
@Service
public class AuthService {
    private final UserEncryptService userEncryptService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CoustomUserDetailsService coustomUserDetailsService;
    private final RoleRepository roleRepository;
    private final SignupRequestRepository signupRequestRepository;

    public AuthService(JwtTokenProvider jwtTokenProvider,UserEncryptService userEncryptService,RoleRepository roleRepository,
                       CoustomUserDetailsService coustomUserDetailsService,UserRepository userRepository, SignupRequestRepository signupRequestRepository){
        this.jwtTokenProvider = jwtTokenProvider;
        this.coustomUserDetailsService = coustomUserDetailsService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userEncryptService = userEncryptService;
        this.signupRequestRepository = signupRequestRepository;
    }

    //회원가입
    public SignupRequest signupRequest(MembershipRequestDTO m){
        String pw = userEncryptService.signup(m.getUserPassword());
        SignupRequest s = SignupRequest.builder().userId(m.getUserId()).userPassword(pw).username(m.getUserName()).userPhoneNumber(m.getUserPhoneNumber()).build();
        return signupRequestRepository.save(s);
    }

    //권한 설정
    public boolean membership(User u, String s){
        Role r;

            if(s.equals("admin")) {
                r = roleRepository.findByRoleName("ADMIN").orElseThrow(() -> new BusinessException(AUTH_NOT_FOUND));
            }else{
                r = roleRepository.findByRoleName("USER").orElseThrow(() -> new BusinessException(AUTH_NOT_FOUND));
            }
            u.addRole(r);

            userRepository.save(u);

        return true;
    }

    //admin 로그인
    public Map<String,Object> adminLogin(LoginRequestDTO l){
            //id 조회
            User u;
            u = userRepository.findByUserId(l.getUserId()).orElseThrow(()->new BusinessException(USER_NOT_FOUND));

            userEncryptService.pwDecrypt(u.getUserId(),l.getPassword());

            UserDetails userdetails= coustomUserDetailsService.loadUserByUsername(l.getUserId());

            List<String> listRoles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            for(String role : listRoles){
                //수정) 권한 없음 403 로그 출력
                if(role.contains("USER")) throw new BusinessException(ACCESS_DENIED);
            }

            Map<String,Object> result = new HashMap<>();
            result.put("token",jwtTokenProvider.generateToken(userdetails));
            result.put("userId",userdetails.getUsername());
            result.put("roles",listRoles);
            return result;
    }

    //user 로그인
    public Map<String,Object> userLogin(LoginRequestDTO l){
        //id 조회
        User u;
        u = userRepository.findByUserId(l.getUserId()).orElseThrow(()->new BusinessException(USER_NOT_FOUND));
        userEncryptService.pwDecrypt(u.getUserId(),l.getPassword());
        UserDetails userdetails = coustomUserDetailsService.loadUserByUsername(l.getUserId());

        List<String> listRoles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        for(String role : listRoles){
            if(role.contains("ADMIN")) throw new BusinessException(ACCESS_DENIED);
        }

        Map<String,Object> result = new HashMap<>();
        result.put("token",jwtTokenProvider.generateToken(userdetails));
        result.put("userId",userdetails.getUsername());
        result.put("roles",listRoles);

        return result;
    }

    //아이디 중복 체크
    public void idDuplicateCheck(String id){
        boolean existsInUser = userRepository.existsByUserId(id);
        boolean existsInSignupRequest = signupRequestRepository.existsByUserId(id);

        if(existsInUser || existsInSignupRequest){
            throw new BusinessException(DUPLICATE_ID);}
    }

    //유저 등록 (ADMIN service로 이전)
    public void approveUser(Long userIndex) {

        SignupRequest req = signupRequestRepository.findById(userIndex)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        User user = User.builder()
                .userId(req.getUserId())
                .username(req.getUsername())
                .userPhoneNumber(req.getUserPhoneNumber())
                .userPassword(req.getUserPassword())
                .build();

        membership(user,"USER");

        if(signupRequestRepository.deleteByUserIndex(userIndex) == 0){
            throw new BusinessException(USER_SAVE_FALSE);
        }
    }
    //유저 등록 (ADMIN service로 이전)
    public void rejectUser(Long userIndex){
        SignupRequest req = signupRequestRepository.findById(userIndex).orElseThrow(() -> new BusinessException(USER_NOT_FOUND));

            req.setAuthStatus(2);   // 변경

        }

    //아이디 찾기
    public String findId(FindIdDTO f){
        boolean chk = userRepository.existsByUsernameAndUserPhoneNumber(f.getUserName(), f.getUserPhoneNumber());
        if(!chk) throw new BusinessException(USER_NOT_FOUND);
        return userRepository.findUserIdByUsernameAndUserPhoneNumber(f.getUserName(), f.getUserPhoneNumber());
    }


    }
