package vn.pvhg.backend.dto.response.notification;

import vn.pvhg.backend.enums.NotificationEventType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        UUID sourceId, // userId maybe
        NotificationEventType type,
        String content,
        boolean read,
        LocalDateTime createdAt,
        UUID referenceId,
        long unreadCount
) {
}
