package vn.pvhg.backend.security;

import vn.pvhg.backend.authentication.dto.response.AuthResourceResponseDTO;
import vn.pvhg.backend.authentication.model.User;
import vn.pvhg.backend.utils.AuthConstant;

public interface JwtService {
    String generateToken(User user, AuthConstant.TokenSubject subject);
    void deleteToken(Long userId);
    AuthResourceResponseDTO getToken(String token);
    boolean validateToken(String token);
    String getEmailFromToken(String token);
}
