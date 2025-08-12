package vn.pvhg.backend.service;

import vn.pvhg.backend.dto.request.LoginRequest;
import vn.pvhg.backend.dto.request.RegisterRequest;
import vn.pvhg.backend.dto.response.AuthResponse;
import vn.pvhg.backend.dto.response.UserResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);
}
