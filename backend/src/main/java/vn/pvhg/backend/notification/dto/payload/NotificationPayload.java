package vn.pvhg.backend.notification.dto.payload;

import vn.pvhg.backend.notification.enums.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationPayload(
        UUID id,
        NotificationType type,
        String title,
        String content,
        UUID relatedId,         // content id for post, message, ...
        UUID senderId,          // the user who trigger it
        Instant createdAt,
        boolean read
) {
}
