package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.entity.Role;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitData implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserEncryptService userEncryptService;

    @Override
    public void run(String...args){

        //권한
        Role r = Role.builder().roleName("ADMIN").build();
        roleRepository.save(r);

        String pw = userEncryptService.signup("admin");
        Role b;
        User a = User.builder().userId("admin").username("jin").userPassword(pw).userPhoneNumber("010-1111-1111").build();

        //비밀번호 암호화
        try{
            b = roleRepository.findByRoleName("ADMIN").orElseThrow(()->new UsernameNotFoundException("해당 권한을 찾을 수 없습니다."));
            a.getUserRoles().add(b);
        }catch(UsernameNotFoundException e){
            System.out.println(e);
        }

        userRepository.save(a);


    }
}
