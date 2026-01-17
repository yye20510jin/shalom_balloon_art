package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.MembershipRequestDTO;
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

    public SignupRequest signupRequest(MembershipRequestDTO m){
        String pw = userEncryptService.signup(m.getUserPassword());
        SignupRequest s = SignupRequest.builder().userId(m.getUserId()).userPassword(pw).username(m.getUserName()).userPhoneNumber(m.getUserPhoneNumber()).build();
        return signupRequestRepository.save(s);
    }

    public boolean membership(User u, String s){
        Role r;
        try{
            if(s.equals("admin")) {
                r = roleRepository.findByRoleName("ADMIN").orElseThrow(() -> new RuntimeException("일치하는 권한이 없습니다."));
            }else{
                r = roleRepository.findByRoleName("USER").orElseThrow(() -> new RuntimeException("일치하는 권한이 없습니다."));
            }

            u.addRole(r);

            userRepository.save(u);
        }catch(RuntimeException e){
            return false;
        }

        return true;
    }

    public Map<String,Object> adminLogin(LoginRequestDTO l){
            //id 조회
            User u;
            u = userRepository.findByUserId(l.getUserId()).orElseThrow(()->new RuntimeException(""));

            userEncryptService.pwDecrypt(u.getUserId(),l.getPassword());

            UserDetails userdetails=coustomUserDetailsService.loadUserByUsername(l.getUserId());
            //User(user.getUserId(), user.getUserPassword(), authorities);

            List<String> listRoles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            for(String role : listRoles){
                if(role.contains("USER")) throw new RuntimeException("");
            }

            Map<String,Object> result = new HashMap<>();
            result.put("token",jwtTokenProvider.generateToken(userdetails));
            result.put("userId",userdetails.getUsername());
            result.put("roles",listRoles);
            return result;
    }

    public Map<String,Object> userLogin(LoginRequestDTO l){
        //id 조회
        User u;
        u = userRepository.findByUserId(l.getUserId()).orElseThrow(()->new RuntimeException(""));
        userEncryptService.pwDecrypt(u.getUserId(),l.getPassword());
        UserDetails userdetails = coustomUserDetailsService.loadUserByUsername(l.getUserId());

        List<String> listRoles = userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        for(String role : listRoles){
            if(role.contains("ADMIN")) throw new RuntimeException("");
        }

        Map<String,Object> result = new HashMap<>();
        result.put("token",jwtTokenProvider.generateToken(userdetails));
        result.put("userId",userdetails.getUsername());
        result.put("roles",listRoles);

        return result;
    }

    public void idDuplicateCheck(String id){
        boolean existsInUser = userRepository.existsByUserId(id);
        boolean existsInSignupRequest = signupRequestRepository.existsByUserId(id);

        if(existsInUser || existsInSignupRequest){
            throw new RuntimeException("이미 사용 중인 아이디 입니다.");
        }
    }

    @Transactional
    public void approveUser(Long userIndex) {

        SignupRequest req = signupRequestRepository.findById(userIndex)
                .orElseThrow(() -> new RuntimeException("요청을 찾을 수 없습니다."));

        User user = User.builder()
                .userId(req.getUserId())
                .username(req.getUsername())
                .userPhoneNumber(req.getUserPhoneNumber())
                .userPassword(req.getUserPassword())
                .build();

        membership(user,"USER");

        if(signupRequestRepository.deleteByUserIndex(userIndex) == 0){
            throw new RuntimeException("삭제 실패");
        }
    }

    @Transactional
    public void rejectUser(Long userIndex){
        SignupRequest req = signupRequestRepository.findById(userIndex).orElseThrow(() -> new RuntimeException("해당 아이디는 존재하지 않습니다."));

            req.setAuthStatus(2);   // 변경

        }
    }
