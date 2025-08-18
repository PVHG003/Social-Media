package vn.pvhg.backend.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.user.service.VerifyUserService;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VerifyUserServiceImpl implements VerifyUserService {
    private final RedisTemplate<String, String> redisTemplate;
    private static final String OTP_PREFIX = "otp:";
    private static final long OTP_EXPIRATION_MINUTES = 5;

    @Override
    public String generateVerificationCode(Long userId) {
        String verificationCode = "1111";
        String redisKey = OTP_PREFIX + userId;
        redisTemplate.opsForValue().set(redisKey, verificationCode, OTP_EXPIRATION_MINUTES, TimeUnit.MINUTES);

        return verificationCode;
    }

    @Override
    public boolean verifyVerificationCode(Long userId, String verificationCode) {
        String redisKey = OTP_PREFIX + userId;
        String verifiedOtp = redisTemplate.opsForValue().get(redisKey);

        if(verifiedOtp != null && verifiedOtp.equals(verificationCode)) {
            redisTemplate.delete(redisKey);
            return true;
        }
        return false;
    }
}
