package vn.pvhg.backend.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.security.impl.UserDetailsImpl;
import vn.pvhg.backend.user.dto.request.*;
import vn.pvhg.backend.user.dto.response.AuthResourceResponseDTO;
import vn.pvhg.backend.user.dto.response.CustomResponse;
import vn.pvhg.backend.user.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public CustomResponse<AuthResourceResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request){
        AuthResourceResponseDTO response = authService.register(request);
        return new CustomResponse<>(true, response, "Đăng kí thành công. Vui lòng kiểm tra email để xác thực tài khoản.");
    }

    @PostMapping("/verify")
    public CustomResponse<AuthResourceResponseDTO> verify(
            @RequestParam ("email") String email,
            @RequestParam("code") String code,
            @AuthenticationPrincipal UserDetailsImpl userDetails
            ){
        Long userId = userDetails.getId();
        AuthResourceResponseDTO response = authService.verify(userId, email, code);
        return new CustomResponse<>(true, response, "Xác thực tài khoản thành công.");
    }

    @PostMapping("/login")
    public CustomResponse<AuthResourceResponseDTO> login(@Valid @RequestBody LoginRequestDTO request){
        AuthResourceResponseDTO response = authService.login(request);
        return new CustomResponse<>(true, response, "Đăng nhập thành công.");
    }

    @PostMapping("/logout")
    public CustomResponse<Void> logout(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        Long userId = currentUser.getId();
        authService.logout(userId);
        return new CustomResponse<>(true, "Đăng xuất thành công.");
    }

    @PostMapping("/forget")
    public CustomResponse<AuthResourceResponseDTO> forgotPassword(@RequestParam("email") String email){
        AuthResourceResponseDTO response = authService.forgotPassword(email);
        return new CustomResponse<>(true, response, "Vui lòng kiểm tra email để xác thực tài khoản.");
    }

    @PostMapping("/reset")
    public CustomResponse<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        Long userId = currentUser.getId();
        authService.resetPassword(userId, request);
        return new CustomResponse<>(true, "Thay đổi mật khẩu thành công.");
    }

    @PostMapping("/change-password")
    public CustomResponse<AuthResourceResponseDTO> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        Long userId = currentUser.getId();
        AuthResourceResponseDTO response = authService.changePassword(userId, request);
        return new CustomResponse<>(true, response, "Thay đổi mật khẩu thành công.");
    }

    @PostMapping("/send-code")
    public CustomResponse<AuthResourceResponseDTO> sendCode(
            @RequestParam("email") String email) {
        authService.sendOtp(email);
        return new CustomResponse<>(true, "Gửi mã OTP thành công");
    }
}
