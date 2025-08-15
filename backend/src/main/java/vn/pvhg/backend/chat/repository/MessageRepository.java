package vn.pvhg.backend.chat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.chat.model.Message;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    // 2. Get the last message for each chat (for preview in chat list)
    @Query("""
            SELECT m
            FROM Message m
            WHERE m.chat.id IN :chatIds
              AND m.sentAt = (
                  SELECT MAX(m2.sentAt)
                  FROM Message m2
                  WHERE m2.chat.id = m.chat.id
              )
            """)
    List<Message> findLastMessagesForChats(@Param("chatIds") List<UUID> chatIds);
    
    @Query("""
            select m
            from Message m
            where m.chat.id = :chatId
            and m.deleted = false
            ORDER BY m.sentAt DESC
            """)
    Page<Message> getAllByChatIdAndDeletedIsFalse(UUID chatId, Pageable pageable);
}