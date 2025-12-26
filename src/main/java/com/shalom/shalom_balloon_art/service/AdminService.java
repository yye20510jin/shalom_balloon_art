package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public List<MembershipResponseDTO> userList(){
        return userRepository.findAll().stream().map(MembershipResponseDTO::from).toList();
    }
}
