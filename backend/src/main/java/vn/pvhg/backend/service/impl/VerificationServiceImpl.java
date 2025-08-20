package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.service.VerificationService;

import java.text.DecimalFormat;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {
    private final RedisTemplate<String, String> redisTemplate;
    private static final String OTP_PREFIX = "otp:";
    private static final long OTP_EXPIRATION_MINUTES = 5;

    @Override
    public String generateAndSaveOtp(Long userId) {
        String otpCode = new DecimalFormat("000000").format(new Random().nextInt(999999));

        String redisKey = OTP_PREFIX + userId;
        redisTemplate.opsForValue().set(redisKey, otpCode, OTP_EXPIRATION_MINUTES, TimeUnit.MINUTES);

        return otpCode;
    }

    @Override
    public boolean verifyOtp(Long userId, String code) {
        String redisKey = OTP_PREFIX + userId;
        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp != null && storedOtp.equals(code)) {
            redisTemplate.delete(redisKey);
            return true;
        }
        return false;
    }
}
