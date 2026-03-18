package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.repository.RoleRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitData implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserEncryptService userEncryptService;

    @Override
    public void run(String...args){
    }
}
