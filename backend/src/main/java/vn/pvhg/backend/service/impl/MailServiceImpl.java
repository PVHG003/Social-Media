package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.config.RabbitMQConfig;
import vn.pvhg.backend.dto.message.EmailMessage;
import vn.pvhg.backend.service.MailService;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receiveAndSendOtp(EmailMessage emailMessage) {
        final String subject = "Your OTP Verification Code";

        try{
            String emailContent = "Your OTP verification code is: " + emailMessage.otpCode() + "\n\n" +
                    "This code will expire in 5 minutes.";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(emailMessage.toEmail());
            message.setSubject(subject);
            message.setText(emailContent);

            mailSender.send(message);
        } catch (Exception e){
            log.error("Gửi email OTP tới {} thất bại: {}", emailMessage.toEmail(), e.getMessage());
        }
    }
}

