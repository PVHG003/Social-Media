package vn.pvhg.backend.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.auth.model.RevokedToken;

import java.time.Instant;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    void deleteByExpiryDateBefore(Instant expiryDateBefore);
}