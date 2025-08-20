package vn.pvhg.backend.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import vn.pvhg.backend.notification.service.NotificationService;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class NotificationWebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationService notificationService;

    @MessageMapping("/notification.read.{notificationId}")
    public void markAsRead(
            @DestinationVariable UUID notificationId,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        notificationService.markAsRead(userId, notificationId);

        simpMessagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                "");
    }
}
