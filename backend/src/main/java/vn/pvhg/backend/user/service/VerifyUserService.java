package vn.pvhg.backend.user.service;

public interface VerifyUserService {
    String generateVerificationCode(Long userId);
    boolean verifyVerificationCode(Long userId, String verificationCode);
}
