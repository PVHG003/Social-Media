package vn.pvhg.backend.user.service;

public interface VerifyUserService {
    String generateAndSaveOtp(Long userId);
    boolean verifyOtp(Long userId, String verificationCode);
}
