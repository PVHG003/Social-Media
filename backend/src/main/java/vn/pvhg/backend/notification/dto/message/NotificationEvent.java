package vn.pvhg.backend.notification.dto.message;

import vn.pvhg.backend.notification.enums.NotificationType;

public record NotificationEvent<T>(
        NotificationType type,
        T data
) {
}
