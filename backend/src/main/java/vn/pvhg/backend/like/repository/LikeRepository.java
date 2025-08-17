package vn.pvhg.backend.like.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.pvhg.backend.like.model.Like;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {
    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    Optional<Like> findByUserIdAndPostId(UUID userId, UUID postId);
}