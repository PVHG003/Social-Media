package vn.pvhg.backend.authentication.service;

import vn.pvhg.backend.authentication.dto.request.*;
import vn.pvhg.backend.authentication.dto.response.AuthResourceResponseDTO;

public interface AuthService {
    AuthResourceResponseDTO register(RegisterRequestDTO request);
    AuthResourceResponseDTO verify(Long userId, String email, String code);
    AuthResourceResponseDTO login(LoginRequestDTO request);
    void logout(Long userId);
    AuthResourceResponseDTO forgotPassword(String email);
    void resetPassword(Long userId, ResetPasswordRequestDTO request);
    AuthResourceResponseDTO changePassword(Long userId, ChangePasswordRequestDTO request);
    void sendOtp(String email);
}
