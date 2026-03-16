package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.HomeCardRequestDTO;
import com.shalom.shalom_balloon_art.dto.HomeCardResponseDTO;
import com.shalom.shalom_balloon_art.dto.login.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.PostTagDTO;
import com.shalom.shalom_balloon_art.entity.HomeCard;
import com.shalom.shalom_balloon_art.entity.User.Role;
import com.shalom.shalom_balloon_art.entity.User.SignupRequest;
import com.shalom.shalom_balloon_art.entity.User.User;
import com.shalom.shalom_balloon_art.entity.post.Tags;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.*;
import com.shalom.shalom_balloon_art.repository.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.*;

@Transactional
@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HomeCardRepository homeCardRepository;
    private final FirebaseStorageService firebaseStorageService;
    private final TagRepository tagRepository;
    private final SignupRequestRepository signupRequestRepository;

    @Transactional(readOnly = true)
    public Page<MembershipResponseDTO> userList(int page){
        Pageable pageable = PageRequest.of(page,5);
        return userRepository.findAll(pageable).map(MembershipResponseDTO::from);
    }

    @Transactional(readOnly = true)
    public List<HomeCardResponseDTO> homeCard(){
        return homeCardRepository.findAll().stream().map(HomeCardResponseDTO::from).toList();
    }

    public void homeCardEdit(HomeCardRequestDTO h){

        if (h.getImgUrl().size() < 2 || h.getText().size() < 2){
            throw new BusinessException(HOME_CARD_LIMIT_EXCEEDED,"");
        }

        for (int i = 0; i < 2; i++){
            int id = i + 1;
            HomeCard card = homeCardRepository.findById(id).orElseThrow(()->new BusinessException(HOME_CARD_NOT_FOUND,""));
            if(!(card.getImgUrl().isBlank()) && !(card.getImgUrl().equals(h.getImgUrl().get(i)))){
                firebaseStorageService.delete(card.getImgUrl());
            }
            card.update(
                    h.getImgUrl().get(i),
                    h.getText().get(i)
            );
        }
    }

    @Transactional(readOnly = true)
    public List<PostTagDTO> getPostTag(){
        return tagRepository.findAll().stream().map(PostTagDTO::from).toList();
    }

    public PostTagDTO createOrGet(String tagName){
        String norm = tagName == null ? null : tagName.trim();
        if(norm == null || norm.isBlank()) throw new BusinessException(TAG_INVALID,"");

        return tagRepository.findByTagName(norm).map(PostTagDTO::from).orElseGet(()->{
            try{
                Tags saved = tagRepository.save(new Tags(norm));
                return PostTagDTO.from(saved);
            }catch(DataIntegrityViolationException e){
                Tags existing = tagRepository.findByTagName(norm).orElseThrow(()->new BusinessException(INTERNAL_ERROR,""));
                return PostTagDTO.from(existing);
            }
        });
    }

    //권한 설정
    public boolean membership(User u, String s){
        Role r;

        if(s.equals("admin")) {
            r = roleRepository.findByRoleName("ADMIN").orElseThrow(() -> new BusinessException(ROLE_NOT_CONFIGURED,""));
        }else{
            r = roleRepository.findByRoleName("USER").orElseThrow(() -> new BusinessException(ROLE_NOT_CONFIGURED,""));
        }
        u.setRole(r);

        userRepository.save(u);

        return true;
    }

    //유저 인증
    public void approveUser(Long userIndex) {

        SignupRequest req = signupRequestRepository.findById(userIndex)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND,""));

        User user = User.builder()
                .userId(req.getUserId())
                .username(req.getUsername())
                .userPhoneNumber(req.getUserPhoneNumber())
                .userPassword(req.getUserPassword())
                .build();

        membership(user,"USER");

        if(signupRequestRepository.deleteByUserIndex(userIndex) == 0){
            throw new BusinessException(RESOURCE_NOT_FOUND,"");
        }
    }

    //유저 비인증
    public void rejectUser(Long userIndex){
        SignupRequest req = signupRequestRepository.findById(userIndex).orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND,""));
        req.setAuthStatus(2);
    }

}
