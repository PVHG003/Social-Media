package vn.pvhg.backend.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.ChatParticipant;

import java.util.List;
import java.util.UUID;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, UUID> {
    @Query("""
            select cp from ChatParticipant cp
            join fetch cp.user
            where cp.chat.id = :chatId
            """)
    List<ChatParticipant> getParticipantsByChatId(UUID chatId);

    @Query("""
            select cp from ChatParticipant cp
            join fetch cp.user
            where cp.chat = :chat
            """)
    List<ChatParticipant> getParticipantsByChat(Chat chat);
}