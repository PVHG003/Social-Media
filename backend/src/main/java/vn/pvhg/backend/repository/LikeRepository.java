package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.interaction.Like;

import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByUserIdAndPostId(Long userId, UUID postId);

    Optional<Like> findByUserIdAndPostId(Long userId, UUID postId);
}
