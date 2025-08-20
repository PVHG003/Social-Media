package vn.pvhg.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.dto.request.ChangePasswordRequest;
import vn.pvhg.backend.dto.request.LoginRequest;
import vn.pvhg.backend.dto.request.PasswordResetRequest;
import vn.pvhg.backend.dto.request.RegisterRequest;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        AuthenticatedResponse response = authService.register(request);
        ApiResponse<AuthenticatedResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Registered success", true, response
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> verify(
            @RequestParam("email") String email,
            @RequestParam("code") String code,
            @AuthenticationPrincipal UserDetailsImpl userDetails

    ) {
        Long userId = userDetails.getUser().getId();
        AuthenticatedResponse response = authService.verify(userId, email, code);
        ApiResponse<AuthenticatedResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Account verified successfully", true, response
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthenticatedResponse response = authService.login(request);
        ApiResponse<AuthenticatedResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Login successful", true, response
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        Long userId = currentUser.getUser().getId();
        authService.logout(userId);
        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Logout successful", true, null
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/forget")
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> forgotPassword(
            @RequestParam("email") String email
    ) {
        AuthenticatedResponse response = authService.forgotPassword(email);
        ApiResponse<AuthenticatedResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Please check your email to verify your account", true, response
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody PasswordResetRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        Long userId = currentUser.getUser().getId();
        authService.resetPassword(userId, request);
        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Password reset successful", true, null
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<AuthenticatedResponse>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser
    ) {
        Long userId = currentUser.getUser().getId();
        AuthenticatedResponse response = authService.changePassword(userId, request);
        ApiResponse<AuthenticatedResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "Password changed successfully", true, response
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Void>> sendCode(
            @RequestParam("email") String email
    ) {
        authService.sendOtp(email);
        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK, "OTP sent successfully", true, null
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
