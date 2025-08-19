package vn.pvhg.backend.authentication.service;

public interface MailService {
    void sendOtpEmail(String toEmail, String otpCode);
}
