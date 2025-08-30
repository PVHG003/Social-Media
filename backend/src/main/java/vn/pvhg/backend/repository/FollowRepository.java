package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.pvhg.backend.model.Follow;
import vn.pvhg.backend.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {
    long countByFollowing(User updatedUser);

    long countByFollower(User updatedUser);

    boolean existsByFollowerAndFollowing(User currentUser, User targetUser);

    Page<Follow> findByFollowing(User targetUser, Pageable pageable);

    Page<Follow> findByFollower(User targetUser, Pageable pageable);

    Optional<Follow> findByFollowerIdAndFollowingId(UUID id, UUID userId);

    @Query("""
            select distinct u
            from User u
            join Follow f on f.follower = u
            where f.following.id = :userId
            """)
    List<User> findFollowersByUserId(UUID userId);
}
