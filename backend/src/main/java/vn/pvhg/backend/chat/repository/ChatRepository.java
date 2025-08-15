package vn.pvhg.backend.chat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.chat.model.Chat;

import java.util.Optional;
import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {

    // 1. Get all conversations where user is a participant (sorted by latest activity)
    @Query("""
            SELECT DISTINCT c
            FROM Chat c
            JOIN c.participants p
            WHERE c.deleted = :deleted and p.user.id = :userId
            ORDER BY c.updatedAt DESC
            """)
    Page<Chat> findAllByUserIdAndDeletedFalse(@Param("userId") UUID userId, boolean deleted, Pageable pageable);

    @Query("""
                SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
                FROM Chat c
                WHERE c.chatType = 'PRIVATE' AND c.deleted = false
                  AND EXISTS (
                      SELECT 1 FROM ChatParticipant p
                      WHERE p.chat = c AND p.user.id = :currentUserId
                  )
                  AND EXISTS (
                      SELECT 1 FROM ChatParticipant p
                      WHERE p.chat = c AND p.user.id = :otherUserId
                  )
            """)
    boolean existsPrivateChatBetween(
            @Param("currentUserId") UUID currentUserId,
            @Param("otherUserId") UUID otherUserId);

    @Query("""
            SELECT c
            FROM Chat c
            WHERE c.id = :id
            AND c.deleted = :deleted
            """)
    Optional<Chat> findByIdAndDeletedFalse(UUID id, boolean deleted);
}
