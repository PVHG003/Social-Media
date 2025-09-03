package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.Post;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Post> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    void deleteByUserId(UUID userId);

    List<Post> findByUserId(UUID userId);
}