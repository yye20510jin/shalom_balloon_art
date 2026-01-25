package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.login.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.entity.SignupRequest;
import com.shalom.shalom_balloon_art.repository.SignupRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SignupRequestService {
    private final SignupRequestRepository signupRequestRepository;

    // 매일 정각에 실행 (cron: 초 분 시 일 월 요일)
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteOldRejectedSignupRequests() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);

        int deletedCount =
                signupRequestRepository.deleteOldRejected(threshold);

        System.out.println("[Cleanup] 30일 지난 비인증 요청 삭제: " + deletedCount + "건");
    }

    public Page<MembershipResponseDTO> userApprove(int page, int auth){
        Pageable pageable = PageRequest.of(page,5);
        SignupRequest s = auth == 0 ? SignupRequest.builder().authStatus(0).build() : SignupRequest.builder().authStatus(2).build();
        Example<SignupRequest> example = Example.of(s);
        return signupRequestRepository.findAll(example,pageable).map(this::toMembershipResponseDTO);
    }

    public MembershipResponseDTO toMembershipResponseDTO(SignupRequest s){
        return MembershipResponseDTO.builder().userIndex(s.getUserIndex()).userName(s.getUsername()).userPhoneNumber(s.getUserPhoneNumber()).
                authStatus(s.getAuthStatus()).createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt()).build();
    }
}
