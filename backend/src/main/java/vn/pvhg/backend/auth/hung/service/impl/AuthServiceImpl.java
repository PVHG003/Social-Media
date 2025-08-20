package vn.pvhg.backend.auth.hung.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.hung.dto.request.LoginRequest;
import vn.pvhg.backend.auth.hung.dto.request.RegisterRequest;
import vn.pvhg.backend.auth.hung.dto.response.AuthResponse;
import vn.pvhg.backend.auth.hung.dto.response.UserResponse;
import vn.pvhg.backend.auth.hung.mapper.UserMapper;
import vn.pvhg.backend.auth.hung.model.User;
import vn.pvhg.backend.auth.hung.repository.UserRepository;
import vn.pvhg.backend.auth.hung.service.AuthService;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.utils.hung.JwtUtils;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationProvider authenticationProvider;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(), request.password())
        );
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        String token = jwtUtils.generateToken(user.getUser().getId(), authentication);
        return new AuthResponse(
                token,
                userMapper.toResponse(user.getUser())
        );
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}