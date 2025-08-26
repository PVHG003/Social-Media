package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.model.chat.Message;

import java.util.Optional;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    @Query("""
            SELECT m FROM Message m
            LEFT JOIN FETCH m.attachments
            WHERE m.id = :id
            """)
    Optional<Message> findByIdWithAttachments(@Param("id") UUID id);

    Page<Message> findByChatId(UUID chatId, Pageable pageable);
}