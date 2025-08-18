package vn.pvhg.backend.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.pvhg.backend.security.impl.UserDetailsImpl;
import vn.pvhg.backend.user.dto.request.*;
import vn.pvhg.backend.user.dto.response.AuthResourceResponseDTO;
import vn.pvhg.backend.user.dto.response.CustomResponse;
import vn.pvhg.backend.user.service.AuthService;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public CustomResponse<AuthResourceResponseDTO> register(@RequestBody RegisterRequestDTO request){
        AuthResourceResponseDTO response = authService.register(request);
        return new CustomResponse<>(true, response, "Registered Successfully");
    }

    @PostMapping("/verify/new-user")
    public CustomResponse<AuthResourceResponseDTO> verifyNewUser(
            @RequestBody VerificationCodeRequestDTO request,
            @AuthenticationPrincipal UserDetailsImpl currentUser){
            Long userId = currentUser.getId();
            AuthResourceResponseDTO response = authService.verifyNewUser(userId, request);
        return new CustomResponse<>(true, response, "Verify Account Successfully");
    }

    @PostMapping("/login")
    public CustomResponse<AuthResourceResponseDTO> login(@RequestBody LoginRequestDTO request){
        AuthResourceResponseDTO response = authService.login(request);
        return new CustomResponse<>(true, response, "Login Successfully");
    }

    @PostMapping("/logout")
    public CustomResponse<Void> logout(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        Long userId = currentUser.getId();
        authService.logout(userId);
        return new CustomResponse<>(true, "Logout Successfully");
    }

    @PostMapping("/forgot-password")
    public CustomResponse<AuthResourceResponseDTO> forgotPassword(@RequestBody ForgotPasswordRequestDTO request){
        AuthResourceResponseDTO response = authService.forgotPassword(request);
        return new CustomResponse<>(true, response, "Please check your email to get OTP.");
    }

    @PostMapping("/verify/reset-password")
    public CustomResponse<AuthResourceResponseDTO> resetPassword(
            @RequestBody VerificationCodeRequestDTO request,
            @AuthenticationPrincipal UserDetailsImpl currentUser){
        Long userId = currentUser.getId();
        AuthResourceResponseDTO response = authService.verifyOtpResetPassword(userId, request);
        return new CustomResponse<>(true, response, "Please enter new password");
    }

    @PostMapping("/reset-password")
    public CustomResponse<Void> resetPassword(
            @RequestBody ResetPasswordRequestDTO request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        Long userId = currentUser.getId();
        authService.resetPassword(userId, request);
        return new CustomResponse<>(true, "Reset Password Successfully, please login again");
    }

    @PostMapping("/change-password")
    public CustomResponse<AuthResourceResponseDTO> changePassword(
            @RequestBody ChangePasswordRequestDTO request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        Long userId = currentUser.getId();
        AuthResourceResponseDTO response = authService.changePassword(userId, request);
        return new CustomResponse<>(true, response, "Change Password Successfully");
    }

}
