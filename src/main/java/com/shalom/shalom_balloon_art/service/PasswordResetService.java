package com.shalom.shalom_balloon_art.service;

import com.shalom.shalom_balloon_art.auth.resetToken.ResetTokenUtil;
import com.shalom.shalom_balloon_art.entity.PasswordResetToken;
import com.shalom.shalom_balloon_art.entity.User;
import com.shalom.shalom_balloon_art.global.error.BusinessException;
import com.shalom.shalom_balloon_art.repository.PasswordResetTokenRepository;
import com.shalom.shalom_balloon_art.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static com.shalom.shalom_balloon_art.global.error.ErrorCode.*;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final UserEncryptService userEncryptService;

    private static final int TOKEN_TTL_MINUTES = 10;

    //토큰 발급
    public String requestReset(String userId, String phone){
        Long userIndex = userRepository.findUserIndexByUserIdAndUserPhoneNumber(userId, phone).orElseThrow(() -> new BusinessException(USER_NOT_FOUND));

        String token = ResetTokenUtil.generateToken();
        String tokenHash = ResetTokenUtil.sha256Hex(token);
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(TOKEN_TTL_MINUTES);

        tokenRepository.save(new PasswordResetToken(userIndex, tokenHash, expiresAt));

        return token;
    }

    //토큰 검증
    public PasswordResetToken getValidToken(String token, LocalDateTime now) {

        if(now == null) {now = LocalDateTime.now();}

        String hash = ResetTokenUtil.sha256Hex(token);

        PasswordResetToken t = tokenRepository
                .findTopByTokenHashOrderByCreatedAtDesc(hash)
                .orElseThrow(() -> new BusinessException(INVALID_RESET_TOKEN));

        if (t.isUsed()) throw new BusinessException(INVALID_RESET_TOKEN);
        if (t.isExpired(now)) throw new BusinessException(EXPIRED_RESET_TOKEN);

        return t;
    }

    //비밀번호 변경
    public void confirmReset(String token, String newPassword){

        LocalDateTime now = LocalDateTime.now();
        PasswordResetToken t = getValidToken(token, now);

        int update = tokenRepository.markUsedIfValid(t.getPwResetIndex(),now);
        if(update == 0){throw new BusinessException(INVALID_RESET_TOKEN);}

        User u = userRepository.findById(t.getUserIndex()).orElseThrow(()->new BusinessException(USER_NOT_FOUND));
        String encoded = userEncryptService.signup(newPassword);
        u.changePw(encoded);

    }

    //토큰 제거
    @Scheduled(cron = "0 10 * * * ?")
    public void deleteToken(){
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.cleanup(now);
    }

}
