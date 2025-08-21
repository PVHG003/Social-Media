package vn.pvhg.backend.service;

import jakarta.validation.Valid;
import vn.pvhg.backend.dto.request.auth.ChangePasswordRequest;
import vn.pvhg.backend.dto.request.auth.LoginRequest;
import vn.pvhg.backend.dto.request.auth.PasswordResetRequest;
import vn.pvhg.backend.dto.request.auth.RegisterRequest;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;

public interface AuthService {

    AuthenticatedResponse register(@Valid RegisterRequest request);

    AuthenticatedResponse verify(Long userId, String email, String code);

    AuthenticatedResponse login(@Valid LoginRequest request);

    void logout(Long userId);

    AuthenticatedResponse forgotPassword(String email);

    void resetPassword(Long userId, @Valid PasswordResetRequest request);

    AuthenticatedResponse changePassword(Long userId, @Valid ChangePasswordRequest request);

    void sendOtp(String email);
}
