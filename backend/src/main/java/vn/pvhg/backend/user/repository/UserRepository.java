package vn.pvhg.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.user.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
