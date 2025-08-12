package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.auth.RevokedToken;

import java.time.Instant;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    void deleteByExpiryDateBefore(Instant expiryDateBefore);
}