package vn.pvhg.backend.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.ChatParticipant;

import java.util.List;
import java.util.UUID;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, UUID> {
    @Query("""
            select cp from ChatParticipant cp
            join fetch cp.user
            where cp.chat = :chat
            """)
    List<ChatParticipant> getParticipantsByChat(Chat chat);

    @Modifying
    @Query("""
            delete from ChatParticipant cp
            where cp.chat.id = :chatId and cp.user.id = :currentUserId
            """)
    int deleteChatParticipantByChatIdAndUserId(UUID chatId, UUID currentUserId);

    @Query("""
            SELECT EXISTS (
                SELECT 1
                FROM ChatParticipant cp
                WHERE cp.chat.id = :chatId
                AND cp.user.id = :memberToAddUserId
            )
            """)
    boolean existsByChatIdAndUserId(UUID chatId, UUID memberToAddUserId);

    @Query("""
            SELECT COUNT(*)
            FROM ChatParticipant cp
            WHERE cp.chat.id = :chatId
            AND cp.isAdmin = :admin
            """)
    long countByChatIdAndIsAdminTrue(UUID chatId);

    @Query("""
            SELECT EXISTS (
                SELECT 1
                FROM ChatParticipant cp
                WHERE cp.chat.id = :chat
                AND cp.user.id = :userId
                AND cp.isAdmin = true
            )
            """)
    boolean existsByChatAndUserIdAndIsAdminTrue(Chat chat, UUID currentUserId);
}