package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.jwt.CustomUserDetails;
import com.shalom.shalom_balloon_art.entity.User.User;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CoustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException{
        User user = userRepository.findByUserId(userId).orElseThrow(()->new UsernameNotFoundException("AUTH_USER_NOT_FOUND"));
        //GrantedAuthority : 이 사용자가 가진 권한을 나타내는 객체
        //SimpleGrantedAuthority : Spring Security에서 권한(ROLE_USER, ROLE_ADMIN 등)을 표현하는 객체
        List<GrantedAuthority> authorities = user.getUserRoles().stream().map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_"+role.getRoleName())).toList();
        //public User(java.lang.String username, java.lang.String password, java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) { /* compiled code */ }
        return new CustomUserDetails(user.getUserIndex(),user.getUserId(), user.getUserPassword(), authorities);
    }
}
