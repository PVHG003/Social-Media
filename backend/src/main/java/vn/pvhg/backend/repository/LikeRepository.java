package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.interaction.Like;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, UUID> {
    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    Optional<Like> findByUserIdAndPostId(UUID userId, UUID postId);

    void deleteByUserId(UUID userId);

    List<Like> findByUserId(UUID userId);
}
