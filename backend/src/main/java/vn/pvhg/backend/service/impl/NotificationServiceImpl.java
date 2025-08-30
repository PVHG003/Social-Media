package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.model.Notification;
import vn.pvhg.backend.repository.NotificationRepository;
import vn.pvhg.backend.service.NotificationService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    @Transactional
    public void createAndSend(Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);

        simpMessagingTemplate.convertAndSendToUser(
                savedNotification.getRecipient().getEmail(),
                "/queue/notifications",
                savedNotification
        );
    }

    @Override
    public void createAndSendBulk(List<Notification> notifications) {
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);

        for (Notification notification : savedNotifications) {
            simpMessagingTemplate.convertAndSendToUser(
                    notification.getRecipient().getEmail(),
                    "/queue/notifications",
                    notification
            );
        }
    }
}
