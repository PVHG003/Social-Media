package vn.pvhg.backend.auth.hung.service;

import java.time.Instant;

public interface RevokedTokenService {
    void revokeToken(String tokenId, Instant expiryDate);

    boolean isTokenRevoked(String tokenId);

    void cleanupExpiredTokens();
}