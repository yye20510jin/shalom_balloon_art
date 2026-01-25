package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.post.PostListResponseDTO;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.PostRepository;
import com.shalom.shalom_balloon_art.repository.PostUserLikeRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.POST_NOT_FOUND;
import static com.shalom.shalom_balloon_art.global.error.ErrorCode.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PostUserLikeRepository postUserLikeRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    //회원탈퇴
    public void unregister(Long userIndex){
        User u = userRepository.findById(userIndex).orElseThrow(() -> new BusinessException(USER_NOT_FOUND));
        // User => 조회수, 태그, 좋아요 DB쪽 ON DELETE CASCADE 완료
        userRepository.delete(u);
    }

    //좋아요 글 목록
    public Page<PostListResponseDTO> getUserLikePosts(Long userIndex, int page){

        Pageable pageable = PageRequest.of(page, 6);
        List<Long> p = postUserLikeRepository.findLikedPostIds(userIndex);

        if(p.isEmpty()){
            throw new BusinessException(POST_NOT_FOUND);
        }

        return postRepository.findByIds(p,pageable).map(r -> PostListResponseDTO.from(r,true));
    }

}
