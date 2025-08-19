package vn.pvhg.backend.user.service;

import vn.pvhg.backend.user.dto.request.*;
import vn.pvhg.backend.user.dto.response.AuthResourceResponseDTO;

public interface AuthService {
    AuthResourceResponseDTO register(RegisterRequestDTO request);
    AuthResourceResponseDTO verifyNewUser(Long userId, VerificationCodeRequestDTO request);
    AuthResourceResponseDTO login(LoginRequestDTO request);
    void logout(Long userId);
    AuthResourceResponseDTO forgotPassword(ForgotPasswordRequestDTO request);
    AuthResourceResponseDTO verifyOtpResetPassword(Long userId, VerificationCodeRequestDTO request);
    void resetPassword(Long userId, ResetPasswordRequestDTO request);
    AuthResourceResponseDTO changePassword(Long userId, ChangePasswordRequestDTO request);
}
