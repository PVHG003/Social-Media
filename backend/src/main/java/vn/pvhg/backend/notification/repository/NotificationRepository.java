package vn.pvhg.backend.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.notification.model.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId);

    List<Notification> findByRecipientIdAndIsReadFalse(UUID recipientId);
}
