package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
            SELECT u
            FROM User u
            WHERE u.isEmailVerified = true
              AND (
                  LOWER( u.firstName) LIKE LOWER( CONCAT('%', :query, '%')) OR
                  LOWER( u.lastName) LIKE LOWER( CONCAT('%', :query, '%')) OR
                  LOWER( u.username) LIKE LOWER( CONCAT('%', :query, '%'))
              )
            """)
    Page<User> searchByName(@Param("query") String query, Pageable pageable);
}