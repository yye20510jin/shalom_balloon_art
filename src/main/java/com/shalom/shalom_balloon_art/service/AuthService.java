package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.JwtTokenProvider;
import com.shalom.shalom_balloon_art.dto.LoginRequestDTO;
import com.shalom.shalom_balloon_art.dto.MembershipDTO;
import com.shalom.shalom_balloon_art.entity.Role;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
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
            Role r = roleRepository.findByRoleName("USER").orElseThrow(() -> new RuntimeException("일치하는 권한이 없습니다."));
            String pw = userEncryptService.signup(m.getUserPassword());
            User u = User.builder().userId(m.getUserId()).userPassword(pw).username(m.getUserName()).userPhoneNumber(m.getUserPhoneNumber()).build();
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
                if(role.equals("USER")) throw new RuntimeException("");
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
            if(role.equals("ADMIN")) throw new RuntimeException("");
        }

        Map<String,Object> result = new HashMap<>();
        result.put("token",jwtTokenProvider.generateToken(userdetails));
        result.put("userId",userdetails.getUsername());
        result.put("roles",listRoles);

        return result;
    }

}
