package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.entity.AdminEntity;
import com.shalom.shalom_balloon_art.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitData implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final UserEncryptService userEncryptService;

    @Override
    public void run(String...args){

        //비밀번호 암호화
        String pw = userEncryptService.signup("admin");
        AdminEntity a = AdminEntity.builder().id("admin").name("양예진").password(pw).build();
        adminRepository.save(a);


    }
}
