package vn.pvhg.backend.auth.hung.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.auth.hung.model.RevokedToken;

import java.time.Instant;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    void deleteByExpiryDateBefore(Instant expiryDateBefore);
}