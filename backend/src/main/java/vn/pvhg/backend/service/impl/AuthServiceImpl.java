package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.dto.request.auth.ChangePasswordRequest;
import vn.pvhg.backend.dto.request.auth.LoginRequest;
import vn.pvhg.backend.dto.request.auth.PasswordResetRequest;
import vn.pvhg.backend.dto.request.auth.RegisterRequest;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;
import vn.pvhg.backend.enums.Role;
import vn.pvhg.backend.enums.TokenSubject;
import vn.pvhg.backend.exception.auth.*;
import vn.pvhg.backend.exception.share.ResourceNotFoundException;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.repository.UserRepository;
import vn.pvhg.backend.service.AuthService;
import vn.pvhg.backend.service.JwtService;
import vn.pvhg.backend.service.MailService;
import vn.pvhg.backend.service.VerificationService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationService verificationService;
    private final MailService mailService;

    @Override
    @Transactional
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        if (!request.password().equals(request.confirmPassword())) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        User user = User.builder()
                .email(request.email())
                .username(request.username())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .isEmailVerified(false)
                .build();
        userRepository.save(user);

        sendOtp(request.email());
    }

    @Override
    public AuthenticatedResponse verify(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!verificationService.verifyOtp(user.getId(), code)) {
            throw new InvalidCredentialsException("OTP code is incorrect or has expired.");
        }

        String token;

        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepository.save(user);

            token = jwtService.generateToken(user, TokenSubject.USER_ACCESS);
        } else {
            throw new InvalidOperationException("Account already verified");
        }

        return jwtService.getToken(token);
    }


    @Override
    public AuthenticatedResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            verificationService.generateAndSaveOtp(user.getId());
            throw new AccountNotVerifiedException("Your account is not verified. A new OTP has been sent.");
        }

        String token = jwtService.generateToken(user, TokenSubject.USER_ACCESS);
        return jwtService.getToken(token);
    }

    @Override
    public void logout(UUID userId) {
        jwtService.deleteToken(userId);
    }

//    @Override
//    public AuthenticatedResponse forgotPassword(String email) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
//
//        String token = jwtService.generateToken(user, TokenSubject.OTP_RESET_PASSWORD);
//
//        verificationService.generateAndSaveOtp(user.getId());
//
//        sendOtp(user.getEmail());
//
//        return jwtService.getToken(token);
//    }


    @Override
    public void resetPassword(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.email()));

        if(!verificationService.verifyOtp(user.getId(), request.code())) {
            throw new InvalidCredentialsException("OTP code is incorrect or has expired.");
        }

        if(!request.new_password().equals(request.confirm_password())) {
            throw new InvalidCredentialsException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.new_password()));
        userRepository.save(user);
    }

    @Override
    public AuthenticatedResponse changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(request.current_password(), user.getPassword())) {
            throw new InvalidCredentialsException("Passwords does not match");
        }

        if (!request.new_password().equals(request.confirm_password())) {
            throw new PasswordMismatchException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.new_password()));
        userRepository.save(user);

        jwtService.deleteToken(user.getId());
        String token = jwtService.generateToken(user, TokenSubject.USER_ACCESS);

        return jwtService.getToken(token);
    }

    @Override
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String otp = verificationService.generateAndSaveOtp(user.getId());
        mailService.sendOtpEmail(user.getEmail(), otp);
    }
}
