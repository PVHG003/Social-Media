package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.model.chat.ChatAttachment;

import java.util.List;
import java.util.UUID;

public interface ChatAttachmentRepository extends JpaRepository<ChatAttachment, UUID> {

    @Query("""
            SELECT att
            FROM ChatAttachment att
            WHERE att.id IN (:attachmentIds)
              AND att.uploader.id = :userId
            """)
    List<ChatAttachment> findAllByIdInAndUploader(@Param("attachmentIds") List<UUID> attachmentIds,
                                                  @Param("userId") UUID userId);
}