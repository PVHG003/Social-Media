package vn.pvhg.backend.authentication.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.exception.AccountNotVerifiedException;
import vn.pvhg.backend.exception.DuplicateResourceException;
import vn.pvhg.backend.exception.InvalidCredentialsException;
import vn.pvhg.backend.exception.ResourceNotFoundException;
import vn.pvhg.backend.security.JwtService;
import vn.pvhg.backend.authentication.dto.request.*;
import vn.pvhg.backend.authentication.dto.response.AuthResourceResponseDTO;
import vn.pvhg.backend.authentication.mapper.AuthMapper;
import vn.pvhg.backend.authentication.model.User;
import vn.pvhg.backend.authentication.repository.UserRepository;
import vn.pvhg.backend.authentication.service.AuthService;
import vn.pvhg.backend.authentication.service.MailService;
import vn.pvhg.backend.authentication.service.VerifyUserService;
import vn.pvhg.backend.utils.AuthConstant;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;
    private final JwtService jwtService;
    private final VerifyUserService verifyUserService;
    private final MailService mailService;

    @Override
    @Transactional
    public AuthResourceResponseDTO register(RegisterRequestDTO request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email đã được sử dụng.");
        }

        User user = authMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        sendOtp(user.getEmail());

        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.OTP_VERIFIED_ACCOUNT);

        return jwtService.getToken(token);
    }

    @Override
    public AuthResourceResponseDTO verify(Long userId, String email, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));

        if(!user.getEmail().equals(email)) {
            throw new ResourceNotFoundException("Email không trùng với email tài khoản");
        }

        if(!verifyUserService.verifyOtp(user.getId(), code)){
            throw new InvalidCredentialsException("Mã OTP không chính xác hoặc đã hết hạn.");
        }

        String token = null;

        if(user.getIsVerified() == AuthConstant.IsVerified.UNVERIFIED.getValue()){
            user.setIsVerified(AuthConstant.IsVerified.VERIFIED.getValue());
            userRepository.save(user);

            token = jwtService.generateToken(user, AuthConstant.TokenSubject.USER_ACCESS);
        } else if (user.getIsVerified() == AuthConstant.IsVerified.VERIFIED.getValue()){
            token = jwtService.generateToken(user, AuthConstant.TokenSubject.RESET_PASSWORD);
        }

        return jwtService.getToken(token);
    }

    @Override
    public AuthResourceResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email hoặc mật khẩu không chính xác"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Email hoặc mật khẩu không chính xác");
        }

        String token = null;
        if (user.getIsVerified() == AuthConstant.IsVerified.VERIFIED.getValue()) {
            token = jwtService.generateToken(user, AuthConstant.TokenSubject.USER_ACCESS);
        } else {
            verifyUserService.generateAndSaveOtp(user.getId());
            throw new AccountNotVerifiedException("Tài khoản của bạn chưa được xác thực. Một mã OTP mới đã được gửi.");
        }

        return jwtService.getToken(token);
    }

    @Override
    public void logout(Long userId) {
        jwtService.deleteToken(userId);
    }

    @Override
    public AuthResourceResponseDTO forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.OTP_RESET_PASSWORD);
        verifyUserService.generateAndSaveOtp(user.getId());

        sendOtp(user.getEmail());

        return jwtService.getToken(token);
    }

    @Override
    public void resetPassword(Long userId, ResetPasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public AuthResourceResponseDTO changePassword(Long userId, ChangePasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));

        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Mật khẩu hiện tại không chính xác.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        jwtService.deleteToken(user.getId());
        String token = jwtService.generateToken(user, AuthConstant.TokenSubject.USER_ACCESS);

        return jwtService.getToken(token);
    }

    @Override
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));

        String otp = verifyUserService.generateAndSaveOtp(user.getId());
        mailService.sendOtpEmail(user.getEmail(), otp);
    }
}
