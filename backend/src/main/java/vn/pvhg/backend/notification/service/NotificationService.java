package vn.pvhg.backend.notification.service;

import java.util.UUID;

public interface NotificationService {
    void markAsRead(UUID userId, UUID notificationId);
}
