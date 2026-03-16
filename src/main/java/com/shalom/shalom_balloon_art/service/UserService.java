package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.post.PostListResponseDTO;
import com.shalom.shalom_balloon_art.dto.post.PostTagDTO;
import com.shalom.shalom_balloon_art.entity.User.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.post.PostRepository;
import com.shalom.shalom_balloon_art.repository.post.PostTagRepository;
import com.shalom.shalom_balloon_art.repository.post.PostUserLikeRepository;
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
    private final UserEncryptService userEncryptService;
    private final PostTagRepository postTagRepository;
    private final PostService postService;

    //회원탈퇴
    public void unregister(Long userIndex){
        User u = userRepository.findById(userIndex).orElseThrow(() -> new BusinessException(USER_NOT_FOUND,""));
        // User => 조회수, 태그, 좋아요 DB쪽 ON DELETE CASCADE 완료
        userRepository.delete(u);
    }

    //좋아요 글 목록
    @Transactional(readOnly = true)
    public Page<PostListResponseDTO> getUserLikePosts(Long userIndex, int page){

        Pageable pageable = PageRequest.of(page, 6);
        List<Long> p = postUserLikeRepository.findLikedPostIds(userIndex);

        if(p.isEmpty()){
            throw new BusinessException(POST_NOT_FOUND,"");
        }

        return postRepository.findByIds(p,pageable).map(r -> PostListResponseDTO.from(r,
                postTagRepository.findTagsByPostIndex(r.getIndex()).stream().map(PostTagDTO::from).toList()
                ,true));
    }

    //비밀번호 확인
    public void chkPw(Long userIndex, String chkPw){
        String userId = userRepository.findUserIdByUserIndex(userIndex);

        if(userId.isBlank()) throw new BusinessException(USER_NOT_FOUND,"");

        boolean chk = userEncryptService.pwChkDecrypt(userId, chkPw);
    }

    //비밀번호 변경
    public void userChangePw(Long userIndex, String newPw){
        User u = userRepository.findById(userIndex).orElseThrow(()->new BusinessException(USER_NOT_FOUND,""));
        String signupPw = userEncryptService.signup(newPw);
        u.changePw(signupPw);
    }

    //전화번호 변경
    public void userChangePhone(Long userIndex, String newPhone){
        User u = userRepository.findById(userIndex).orElseThrow(()->new BusinessException(USER_NOT_FOUND,""));
        u.changePn(newPhone);
    }

}
