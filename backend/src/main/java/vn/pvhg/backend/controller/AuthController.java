package vn.pvhg.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.dto.request.auth.*;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.AuthService;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.register(request);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "Registered success, check your email to verify account", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> verify(
            @RequestParam("email") String email,
            @RequestParam("code") String code
    ) {
        AuthenticatedResponse data = authService.verify(email, code);
        ApiResponse<AuthenticatedResponse> response = new ApiResponse<>(
                HttpStatus.OK, "Account verified successfully", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthenticatedResponse data = authService.login(request);
        ApiResponse<AuthenticatedResponse> response = new ApiResponse<>(
                HttpStatus.OK, "Login successful", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        UUID userId = currentUser.getUser().getId();
        authService.logout(userId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "Logout successful", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/forget")
    @SecurityRequirements
    @Operation(summary = "Request password reset", security = @SecurityRequirement(name = "bearerAuth", scopes = {}))
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @RequestParam("email") String email
    ) {
        authService.sendOtp(email);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "OTP sent successfully", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/reset")
    @SecurityRequirements
    @Operation(summary = "Reset password with OTP", security = @SecurityRequirement(name = "bearerAuth", scopes = {}))
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody PasswordResetRequest request
    ) {
        authService.resetPassword(request);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "Password reset successful", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        UUID userId = currentUser.getUser().getId();
        AuthenticatedResponse data = authService.changePassword(userId, request);
        ApiResponse<AuthenticatedResponse> response = new ApiResponse<>(
                HttpStatus.OK, "Password changed successfully", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/send-code")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<Void>> sendCode(
            @RequestParam("email") String email
    ) {
        authService.sendOtp(email);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "OTP sent successfully", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ){
        AuthenticatedResponse data = authService.refreshToken(request);
        ApiResponse<AuthenticatedResponse> response = new ApiResponse<>(
                HttpStatus.OK, "Refresh token successful", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
