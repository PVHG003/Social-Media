package vn.pvhg.backend.auth.hung.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.pvhg.backend.auth.hung.dto.request.LoginRequest;
import vn.pvhg.backend.auth.hung.dto.request.RegisterRequest;
import vn.pvhg.backend.auth.hung.dto.response.AuthResponse;
import vn.pvhg.backend.auth.hung.dto.response.UserResponse;
import vn.pvhg.backend.auth.hung.service.AuthService;
import vn.pvhg.backend.response.ApiResponse;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        ApiResponse<AuthResponse> response = new ApiResponse<>(HttpStatus.OK, "Login success", true, authResponse);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@RequestBody RegisterRequest request) {
        UserResponse userResponse = authService.register(request);
        ApiResponse<UserResponse> response = new ApiResponse<>(HttpStatus.OK, "Register success", true, userResponse);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }
}