package vn.pvhg.backend.service;


import vn.pvhg.backend.dto.response.AuthenticatedResponse;
import vn.pvhg.backend.enums.TokenSubject;
import vn.pvhg.backend.model.User;

import java.util.UUID;

public interface JwtService {
    String generateToken(User user, TokenSubject subject);

    void deleteToken(UUID userId);

    AuthenticatedResponse getToken(String accessToken, String refreshToken);

    boolean validateToken(String token);

    String getEmailFromToken(String token);
}