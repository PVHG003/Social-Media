package vn.pvhg.backend.authentication.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.authentication.service.MailService;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        final String subject = "Mã xác thực OTP của bạn";

        try {
            String emailContent = "Mã xác thực OTP của bạn là: " + otpCode + "\n\n" +
                    "Mã này sẽ hết hạn trong 5 phút.";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(emailContent);

            mailSender.send(message);
        } catch (MailException e) {
            //throw new EmailSendingFailedException("Could not send OTP email to " + toEmail, e);
        }
    }
}
