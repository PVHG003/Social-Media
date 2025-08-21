package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.dto.response.notification.NotificationResponse;
import vn.pvhg.backend.enums.NotificationEventType;
import vn.pvhg.backend.mapper.NotificationMapper;
import vn.pvhg.backend.model.Notification;
import vn.pvhg.backend.repository.NotificationRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.NotificationService;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public Page<NotificationResponse> getNotifications(UserDetailsImpl userDetails, Pageable pageable) {
        UUID currentUserId = userDetails.getUser().getId();
        Page<Notification> notifications = notificationRepository.findAllByRecipientId(currentUserId, pageable);

        long unreadCount = notificationRepository.countByRecipientIdAndReadFalse(currentUserId);
        List<NotificationResponse> notificationResponses = notifications.stream()
                .map(notification -> notificationMapper.toNotificationResponse(notification, unreadCount))
                .toList();
        return new PageImpl<>(notificationResponses, pageable, notifications.getTotalElements());
    }

    public void sendNotification(
            UUID recipientId,
            UUID sourceUserId,
            NotificationEventType type,
            String content,
            UUID referenceId
    ) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .sourceUserId(sourceUserId)
                .type(type)
                .content(content)
                .referenceId(referenceId)
                .read(false)
                .build();
        notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.toNotificationResponse(notification,
                notificationRepository.countByRecipientIdAndReadFalse(recipientId));

        sendToUser(recipientId, response);
    }

    private void sendToUser(UUID recipientId, NotificationResponse response) {
        simpMessagingTemplate.convertAndSendToUser(
                recipientId.toString(),       // the "user" (must match Principal name)
                "/queue/notifications",      // destination
                response                      // payload
        );
    }
}
