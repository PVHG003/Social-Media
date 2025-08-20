package vn.pvhg.backend.service;

public interface MailService {
    void sendOtpEmail(String toEmail, String otpCode);
}
