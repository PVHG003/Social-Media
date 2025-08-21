package vn.pvhg.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.dto.response.notification.NotificationResponse;
import vn.pvhg.backend.model.Notification;

@Component
@RequiredArgsConstructor
public class NotificationMapper {
    public NotificationResponse toNotificationResponse(Notification notification, long unreadCount) {
        return new NotificationResponse(
                notification.getId(),
                notification.getSourceUserId(),
                notification.getType(),
                notification.getContent(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getReferenceId(),
                unreadCount
        );
    }

}
