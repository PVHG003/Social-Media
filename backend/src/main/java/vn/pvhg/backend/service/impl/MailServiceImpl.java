package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.exception.auth.MailSendingException;
import vn.pvhg.backend.service.MailService;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        final String subject = "Your OTP Verification Code";

        try {
            String emailContent = "Your OTP verification code is: " + otpCode + "\n\n" +
                    "This code will expire in 5 minutes.";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(emailContent);

            mailSender.send(message);
        } catch (MailException e) {
            throw new MailSendingException("Could not send OTP email to " + toEmail, e);
        }
    }
}

