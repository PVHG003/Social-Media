package vn.pvhg.backend.notification.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.notification.exception.NotificationNotFoundException;
import vn.pvhg.backend.notification.model.Notification;
import vn.pvhg.backend.notification.repository.NotificationRepository;
import vn.pvhg.backend.notification.service.NotificationService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    @Override
    public void markAsRead(UUID userId, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
