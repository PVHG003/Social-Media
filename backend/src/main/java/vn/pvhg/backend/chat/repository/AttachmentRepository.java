package vn.pvhg.backend.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import vn.pvhg.backend.chat.model.Attachment;

import java.util.List;
import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {

    @Query("""
            SELECT att
            FROM Attachment att
            WHERE att.id IN (:attachmentIds)
              AND att.uploader.id = :userId
            """)
    List<Attachment> findAllByIdInAndUploader(@Param("attachmentIds") List<UUID> attachmentIds,
                                              @Param("userId") UUID userId);
}