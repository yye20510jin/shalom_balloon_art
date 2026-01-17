package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.HomeCardRequestDTO;
import com.shalom.shalom_balloon_art.dto.HomeCardResponseDTO;
import com.shalom.shalom_balloon_art.dto.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.PostTagDTO;
import com.shalom.shalom_balloon_art.entity.HomeCard;
import com.shalom.shalom_balloon_art.entity.post.Tags;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.HomeCardRepository;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import com.shalom.shalom_balloon_art.repository.TagRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
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
public class AdminService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final HomeCardRepository homeCardRepository;
    private final FirebaseStorageService firebaseStorageService;
    private final TagRepository tagRepository;

    public AdminService(UserRepository userRepository, PostRepository postRepository,HomeCardRepository homeCardRepository,
                        FirebaseStorageService firebaseStorageService,TagRepository tagRepository ){
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.homeCardRepository = homeCardRepository;
        this.firebaseStorageService = firebaseStorageService;
        this.tagRepository = tagRepository;
    }

    public Page<MembershipResponseDTO> userList(int page){
        Pageable pageable = PageRequest.of(page,5);
        return userRepository.findAll(pageable).map(MembershipResponseDTO::from);
    }

    public List<HomeCardResponseDTO> homeCard(){
        return homeCardRepository.findAll().stream().map(HomeCardResponseDTO::from).toList();
    }

    public void homeCardEdit(HomeCardRequestDTO h){

        if (h.getImgUrl().size() < 2 || h.getText().size() < 2){
            throw new IllegalArgumentException("홈 카드 데이터는 2개가 필요합니다.");
        }

        for (int i = 0; i < 2; i++){
            int id = i + 1;
            HomeCard card = homeCardRepository.findById(id).orElseThrow(()->new IllegalArgumentException("홈카드("+id+")가 존재하지 않습니다."));
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
        if(norm == null || norm.isBlank()) throw new BusinessException(TAG_NAME_REQUIRED);

        return tagRepository.findByTagName(norm).map(PostTagDTO::from).orElseGet(()->{
            try{
                Tags saved = tagRepository.save(new Tags(norm));
                return PostTagDTO.from(saved);
            }catch(DataIntegrityViolationException e){
                Tags existing = tagRepository.findByTagName(norm).orElseThrow(()->new BusinessException(TAG_NOT_SAVE));
                return PostTagDTO.from(existing);
            }
        });
    }
}
