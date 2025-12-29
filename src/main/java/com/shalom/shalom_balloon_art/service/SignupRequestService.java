package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.dto.MembershipResponseDTO;
import com.shalom.shalom_balloon_art.entity.SignupRequest;
import com.shalom.shalom_balloon_art.repository.SignupRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SignupRequestService {
    private final SignupRequestRepository signupRequestRepository;

    // 매일 새벽 3시에 실행 (cron: 초 분 시 일 월 요일)
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteOldRejectedSignupRequests() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);

        int deletedCount =
                signupRequestRepository.deleteOldRejected(threshold);

        System.out.println("[Cleanup] 30일 지난 비인증 요청 삭제: " + deletedCount + "건");
    }

    public Page<MembershipResponseDTO> userApprove(int page){
        Pageable pageable = PageRequest.of(page,5);
        return signupRequestRepository.findAll(pageable).map(this::toMembershipResponseDTO);
    }

    public MembershipResponseDTO toMembershipResponseDTO(SignupRequest s){
        System.out.println("toMembershipResponseDTO");
        return MembershipResponseDTO.builder().userIndex(s.getUserIndex()).userName(s.getUsername()).userPhoneNumber(s.getUserPhoneNumber()).
            createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt()).build();
    }
}
