package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.user.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}