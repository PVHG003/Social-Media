package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.model.interaction.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    Page<Comment> findByPostIdOrderByCreatedAtDesc(UUID postId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    Long countByPostId(@Param("postId") UUID postId);

    Page<Comment> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    void deleteByUserId(UUID userId);

    List<Comment> findByUserId(UUID userId);
}
