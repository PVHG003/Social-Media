package vn.pvhg.backend.auth.hung.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.hung.model.RevokedToken;
import vn.pvhg.backend.auth.hung.repository.RevokedTokenRepository;
import vn.pvhg.backend.auth.hung.service.RevokedTokenService;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RevokedTokenServiceImpl implements RevokedTokenService {
    private final RevokedTokenRepository revokedTokenRepository;

    @Override
    public void revokeToken(String tokenId, Instant expiryDate) {
        RevokedToken revokedToken = new RevokedToken(tokenId, Instant.now(), expiryDate);
        revokedTokenRepository.save(revokedToken);
    }

    @Override
    public boolean isTokenRevoked(String tokenId) {
        RevokedToken revokedToken = revokedTokenRepository.findById(tokenId).orElse(null);
        return revokedToken != null;
    }

    @Override
    public void cleanupExpiredTokens() {
        revokedTokenRepository.deleteByExpiryDateBefore(Instant.now());
    }
}