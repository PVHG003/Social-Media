package vn.pvhg.backend.auth.hung.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.auth.hung.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
