package vn.pvhg.backend.authentication.service;

public interface VerifyUserService {
    String generateAndSaveOtp(Long userId);
    boolean verifyOtp(Long userId, String verificationCode);
}
