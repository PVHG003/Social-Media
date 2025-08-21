package vn.pvhg.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.Notification;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findAllByRecipientId(UUID recipientId, Pageable pageable);

    long countByRecipientIdAndReadFalse(UUID recipientId);
}