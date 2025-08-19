package vn.pvhg.backend.user.service;

public interface MailService {
    void sendOtpEmail(String toEmail, String otpCode);
}
