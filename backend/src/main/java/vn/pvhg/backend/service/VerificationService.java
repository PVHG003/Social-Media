package vn.pvhg.backend.service;

public interface VerificationService {
    boolean verifyOtp(Long id, String code);

    String generateAndSaveOtp(Long id);
}
