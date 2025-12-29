package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.dto.PostImageDTO;
import com.shalom.shalom_balloon_art.dto.PostListResponseDTO;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public AdminService(UserRepository userRepository, PostRepository postRepository){
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public Page<MembershipResponseDTO> userList(int page){
        Pageable pageable = PageRequest.of(page,5);
        return userRepository.findAll(pageable).map(MembershipResponseDTO::from);
    }

    public Page<PostListResponseDTO> adminDashboard(){
        Pageable pageable = PageRequest.of(0,3,
                Sort.by(
                        Sort.Order.desc("views"),
                        Sort.Order.desc("createdAt")
                ));
        return postRepository.findAll(pageable).map(PostListResponseDTO::from);
    }
}
