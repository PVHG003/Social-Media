package vn.pvhg.backend.auth.hung.service;

import vn.pvhg.backend.auth.hung.dto.request.LoginRequest;
import vn.pvhg.backend.auth.hung.dto.request.RegisterRequest;
import vn.pvhg.backend.auth.hung.dto.response.AuthResponse;
import vn.pvhg.backend.auth.hung.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);
}
