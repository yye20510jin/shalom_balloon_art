package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.MembershipDTO;
import com.shalom.shalom_balloon_art.entity.Role;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {
    private final UserEncryptService userEncryptService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CoustomUserDetailsService coustomUserDetailsService;
    private final RoleRepository roleRepository;

    public AuthService(JwtTokenProvider jwtTokenProvider,UserEncryptService userEncryptService,RoleRepository roleRepository,
                       CoustomUserDetailsService coustomUserDetailsService,UserRepository userRepository){
        this.jwtTokenProvider = jwtTokenProvider;
        this.coustomUserDetailsService = coustomUserDetailsService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userEncryptService = userEncryptService;

    }

    public boolean membership(MembershipDTO m){

        try{
            Role r = roleRepository.findByRoleName("USER").orElseThrow(() -> new RuntimeException());
            String pw = userEncryptService.signup(m.getUserPassword());
            User u = User.builder().userId(m.getUserId()).userPassword(pw).username(m.getUserName()).userPhoneNumber(m.getUserPhoneNumber()).build();
            u.addRole(r);

            userRepository.save(u);
        }catch(RuntimeException e){
            return false;
        }

        return true;
    }

    public Map<String,Object> adminLogin(LoginRequestDTO loginRequestDTO){
            //id 조회
            User u;
            try{
                u = userRepository.findByUserId(loginRequestDTO.getUserId()).orElseThrow(()->new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다."));}
            catch(RuntimeException e){
                System.out.println("찾는 id 없음");
                throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
            if(!userEncryptService.pwDecrypt(u.getUserId(),loginRequestDTO.getPassword())) {
                throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
            UserDetails userdetails=coustomUserDetailsService.loadUserByUsername(loginRequestDTO.getUserId());
            //User(user.getUserId(), user.getUserPassword(), authorities);
            Map<String,Object> result = new HashMap<>();
            result.put("token",jwtTokenProvider.generateToken(userdetails));
            result.put("userId",userdetails.getUsername());
            result.put("roles",userdetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
            return result;
    }

}
