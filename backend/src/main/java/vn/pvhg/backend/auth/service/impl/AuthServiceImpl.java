package vn.pvhg.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.dto.request.LoginRequest;
import vn.pvhg.backend.auth.dto.request.RegisterRequest;
import vn.pvhg.backend.auth.dto.response.AuthResponse;
import vn.pvhg.backend.auth.dto.response.UserResponse;
import vn.pvhg.backend.auth.service.AuthService;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Override
    public AuthResponse login(LoginRequest request) {
        return null;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        return null;
    }
}
