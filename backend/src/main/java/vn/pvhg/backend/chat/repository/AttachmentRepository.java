package vn.pvhg.backend.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.pvhg.backend.chat.enums.AttachmentStatus;
import vn.pvhg.backend.chat.model.Attachment;

import java.util.List;
import java.util.UUID;

public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
    @Query("""
            select a from Attachment a
            where a.status = :attachmentStatus
            """)
    List<Attachment> findByStatus(AttachmentStatus attachmentStatus);

    @Query("""
            select a from Attachment a
            where a.id in :attachmentIds
            """)
    List<Attachment> findAllAttachments(List<String> attachmentIds);

}