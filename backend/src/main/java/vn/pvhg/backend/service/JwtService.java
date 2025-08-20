package vn.pvhg.backend.service;


import vn.pvhg.backend.dto.response.AuthenticatedResponse;
import vn.pvhg.backend.enums.TokenSubject;
import vn.pvhg.backend.model.User;

public interface JwtService {
    String generateToken(User user, TokenSubject subject);

    void deleteToken(Long userId);

    AuthenticatedResponse getToken(String token);

    boolean validateToken(String token);

    String getEmailFromToken(String token);
}