package vn.pvhg.backend.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.authentication.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    boolean existsByEmail(String email);
}
