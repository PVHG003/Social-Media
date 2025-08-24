package vn.pvhg.backend.service;

import jakarta.validation.Valid;
import vn.pvhg.backend.dto.request.auth.ChangePasswordRequest;
import vn.pvhg.backend.dto.request.auth.LoginRequest;
import vn.pvhg.backend.dto.request.auth.PasswordResetRequest;
import vn.pvhg.backend.dto.request.auth.RegisterRequest;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;

import java.util.UUID;

public interface AuthService {

    void register(@Valid RegisterRequest request);

    AuthenticatedResponse verify(String email, String code);

    AuthenticatedResponse login(@Valid LoginRequest request);

    void logout(UUID userId);

//    AuthenticatedResponse forgotPassword(String email);

    void resetPassword(@Valid PasswordResetRequest request);

    AuthenticatedResponse changePassword(UUID userId, @Valid ChangePasswordRequest request);

    void sendOtp(String email);
}
