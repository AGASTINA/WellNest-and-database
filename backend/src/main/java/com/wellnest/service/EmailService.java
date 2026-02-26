package com.wellnest.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.mail.fail-open:false}")
    private boolean failOpen;
    
    public boolean sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("WellNest - Password Reset OTP");
            message.setText(String.format(
                "Hello %s,\n\n" +
                "You have requested to reset your password for your WellNest account.\n\n" +
                "Your OTP is: %s\n\n" +
                "This OTP will expire in 10 minutes.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "WellNest Team",
                userName, otp
            ));
            
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            logger.warn("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            if (failOpen) {
                return false;
            }
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}
