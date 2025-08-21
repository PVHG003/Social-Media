package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.Follow;
import vn.pvhg.backend.model.User;

import java.util.Optional;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {
    long countByFollowing(User updatedUser);

    long countByFollower(User updatedUser);

    boolean existsByFollowerAndFollowing(User currentUser, User targetUser);

    Page<Follow> findByFollowing(User targetUser, Pageable pageable);

    Page<Follow> findByFollower(User targetUser, Pageable pageable);

    Optional<Follow> findByFollowerIdAndFollowingId(UUID id, UUID userId);
}