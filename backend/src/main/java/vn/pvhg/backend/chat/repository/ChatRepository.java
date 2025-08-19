package vn.pvhg.backend.chat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.chat.model.Chat;

import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {

    @Query("""
            SELECT c, m
            FROM Chat c
            JOIN c.members cm
            JOIN cm.member u
            LEFT JOIN c.messages m ON m.sentAt = (
                SELECT MAX(m2.sentAt)
                FROM Message m2
                WHERE m2.chat.id = c.id
            )
            WHERE cm.member.id = :currentUserId
            ORDER BY m.sentAt DESC
            """)
    Page<Object[]> getUserChatWithLatestMessage(@Param("currentUserId") UUID currentUserId, Pageable pageable);

    @Query("""
            SELECT CASE WHEN COUNT(cm) > 0 THEN true ELSE false END
            FROM ChatMember cm
            WHERE cm.member.id = :currentUserId AND cm.chat.id = :chatId
            """)
    boolean existsByMemberIdAndChatId(@Param("currentUserId") UUID currentUserId, @Param("chatId") UUID chatId);

    @Query("""
            SELECT CASE WHEN COUNT(cm) > 0 THEN true ELSE false END
            FROM ChatMember cm
            WHERE cm.member.id = :currentUserId AND cm.chat.id IN (
                SELECT c.id
                FROM Chat c
                JOIN c.members cm2
                WHERE cm2.member.id = :otherMemberId AND c.chatType = 'PRIVATE'
            )
            """)
    boolean existsBetweenMembers(UUID currentUserId, UUID otherMemberId);
}