package vn.pvhg.backend.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.auth.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
