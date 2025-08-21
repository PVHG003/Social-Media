package vn.pvhg.backend.service;

import java.util.UUID;

public interface VerificationService {
    boolean verifyOtp(UUID id, String code);

    String generateAndSaveOtp(UUID id);
}
