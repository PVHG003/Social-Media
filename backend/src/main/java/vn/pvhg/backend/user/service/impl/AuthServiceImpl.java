package vn.pvhg.backend.user.service.impl;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.security.JwtService;
import vn.pvhg.backend.user.dto.request.*;
import vn.pvhg.backend.user.dto.response.AuthResourceResponseDTO;
import vn.pvhg.backend.user.mapper.AuthMapper;
import vn.pvhg.backend.user.model.User;
import vn.pvhg.backend.user.repository.UserRepository;
import vn.pvhg.backend.user.service.AuthService;
import vn.pvhg.backend.user.service.VerifyUserService;
import vn.pvhg.backend.utils.AuthConstant;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper userMapper;
    private final JwtService jwtService;
    private final VerifyUserService verifyUserService;

    @Override
    @Transactional
    public AuthResourceResponseDTO register(RegisterRequestDTO request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new EntityExistsException("User already exists with email: " + request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.OTP_VERIFIED_ACCOUNT);
        verifyUserService.generateVerificationCode(user.getId());

        return jwtService.getToken(token);
    }

    @Override
    public AuthResourceResponseDTO verifyNewUser(Long userId, VerificationCodeRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        if(user.getIsVerified() == AuthConstant.IsVerified.VERIFIED.getValue()){
            throw new IllegalArgumentException("Tài khoản đã được xác thực");
        }

        if(!verifyUserService.verifyVerificationCode(user.getId(), request.getVerificationCode())){
            throw new BadCredentialsException("Mã OTP không chính xác");
        }

        user.setIsVerified(AuthConstant.IsVerified.VERIFIED.getValue());
        userRepository.save(user);

        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.USER_ACCESS);

        return jwtService.getToken(token);
    }

    @Override
    public AuthResourceResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User with email: " + request.getEmail() + " not found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Mật khẩu không chính xác");
        }

        String token = null;
        if (user.getIsVerified() == AuthConstant.IsVerified.VERIFIED.getValue()) {
            token = jwtService.generateToken(user, AuthConstant.TokenSubject.USER_ACCESS);
        } else {
            verifyUserService.generateVerificationCode(user.getId());
            throw new BadCredentialsException("Bạn cần xác thực tài khoản trước khi đăng nhập");
        }

        return jwtService.getToken(token);
    }

    @Override
    public void logout(Long userId) {
        jwtService.deleteToken(userId);
    }

    @Override
    public AuthResourceResponseDTO forgotPassword(ForgotPasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User with email: " + request.getEmail() + " not found"));
        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.OTP_RESET_PASSWORD);
        verifyUserService.generateVerificationCode(user.getId());

        return jwtService.getToken(token);
    }

    @Override
    public AuthResourceResponseDTO verifyOtpResetPassword(Long userId, VerificationCodeRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        if(!verifyUserService.verifyVerificationCode(user.getId(), request.getVerificationCode())){
            throw new BadCredentialsException("Mã OTP không chính xác hoặc đã hết hạn.");
        }

        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.RESET_PASSWORD);

        return jwtService.getToken(token);
    }

    @Override
    public void resetPassword(Long userId, ResetPasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public AuthResourceResponseDTO changePassword(Long userId, ChangePasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " not found"));

        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
            throw new BadCredentialsException("Mật khẩu hiện tại không chính xác.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        jwtService.deleteToken(user.getId());
        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.USER_ACCESS);

        return jwtService.getToken(token);
    }


}
