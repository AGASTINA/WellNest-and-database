package com.wellnest.service;

import com.wellnest.dto.*;
import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Value("${otp.expiration.minutes:10}")
    private int otpExpirationMinutes;

    @Value("${app.mail.fail-open:false}")
    private boolean mailFailOpen;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    private final RestTemplate restTemplate = new RestTemplate();
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAuthProvider("LOCAL");
        user.setRole(resolveRole(request.getRole()));
        
        // Save user
        user = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        
        // Create UserDto
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
        
        return new AuthResponse("Registration successful", token, userDto);
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Verify password
        if (user.getPassword() == null) {
            throw new RuntimeException("Please sign in with Google for this account");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        
        // Create UserDto
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
        
        return new AuthResponse("Login successful", token, userDto);
    }
    
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with this email"));
        
        // Generate OTP
        String otp = generateOTP();
        
        // Set OTP and expiry time
        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(otpExpirationMinutes));
        
        // Save user
        userRepository.save(user);
        
        // Send OTP via email
        boolean sent = emailService.sendOtpEmail(user.getEmail(), otp, user.getName());
        
        if (sent) {
            return new MessageResponse("OTP sent to your email");
        }

        if (mailFailOpen) {
            return new MessageResponse("Email service unavailable. Use this OTP to continue: " + otp);
        }

        throw new RuntimeException("Failed to send email");
    }
    
    public MessageResponse verifyOtp(VerifyOtpRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if OTP exists
        if (user.getOtp() == null) {
            throw new RuntimeException("No OTP found. Please request a new one");
        }
        
        // Check if OTP is expired
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one");
        }
        
        // Verify OTP
        if (!user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
        
        return new MessageResponse("OTP verified successfully");
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new RuntimeException("Google login is not configured");
        }

        GoogleTokenInfo tokenInfo = fetchGoogleTokenInfo(request.getIdToken());

        if (tokenInfo == null || tokenInfo.email == null || tokenInfo.email.isBlank()) {
            throw new RuntimeException("Invalid Google token");
        }

        if (!googleClientId.equals(tokenInfo.aud)) {
            throw new RuntimeException("Invalid Google token audience");
        }

        if (!"true".equalsIgnoreCase(tokenInfo.email_verified)) {
            throw new RuntimeException("Google email not verified");
        }

        User user = userRepository.findByEmail(tokenInfo.email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(tokenInfo.email);
                    newUser.setName(resolveName(tokenInfo));
                    newUser.setAuthProvider("GOOGLE");
                    newUser.setRole("USER");
                    newUser.setPassword(null);
                    return userRepository.save(newUser);
                });

        String token = jwtService.generateToken(user.getEmail(), user.getId());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
        return new AuthResponse("Google login successful", token, userDto);
    }
    
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if OTP exists
        if (user.getOtp() == null) {
            throw new RuntimeException("No OTP found. Please request a new one");
        }
        
        // Check if OTP is expired
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one");
        }
        
        // Verify OTP
        if (!user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        
        // Clear OTP
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        
        // Save user
        userRepository.save(user);
        
        return new MessageResponse("Password reset successfully");
    }
    
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private GoogleTokenInfo fetchGoogleTokenInfo(String idToken) {
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            return restTemplate.getForObject(url, GoogleTokenInfo.class);
        } catch (RestClientException ex) {
            throw new RuntimeException("Invalid Google token");
        }
    }

    private String resolveName(GoogleTokenInfo tokenInfo) {
        if (tokenInfo.name != null && !tokenInfo.name.isBlank()) {
            return tokenInfo.name;
        }
        String given = tokenInfo.given_name == null ? "" : tokenInfo.given_name.trim();
        String family = tokenInfo.family_name == null ? "" : tokenInfo.family_name.trim();
        String combined = (given + " " + family).trim();
        return combined.isBlank() ? "WellNest User" : combined;
    }

    private String resolveRole(String role) {
        if (role == null || role.isBlank()) {
            return "USER";
        }
        String normalized = role.trim().toUpperCase();
        if (!"USER".equals(normalized) && !"ADMIN".equals(normalized)) {
            throw new RuntimeException("Invalid role");
        }
        return normalized;
    }

    private static class GoogleTokenInfo {
        public String email;
        public String name;
        public String aud;
        public String email_verified;
        public String given_name;
        public String family_name;
    }
}
