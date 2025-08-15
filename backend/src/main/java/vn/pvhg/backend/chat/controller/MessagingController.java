package vn.pvhg.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import vn.pvhg.backend.chat.dto.event.MessageEvent;
import vn.pvhg.backend.chat.dto.payload.MessagePayload;
import vn.pvhg.backend.chat.dto.response.MessageDto;
import vn.pvhg.backend.chat.enums.MessageEventType;
import vn.pvhg.backend.chat.service.MessageService;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;

import java.security.Principal;
import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MessagingController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @MessageMapping("/chat.sendMessage/{chatId}")
    public void sendMessage(
            @DestinationVariable UUID chatId,
            @Payload MessagePayload messagePayload,
            Principal principal
    ) {
        UserDetailsImpl user = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());
        MessageDto message = messageService.saveMessage(user.getUser().getId(), chatId, messagePayload);

        simpMessagingTemplate.convertAndSend(
                "/topic/chat/" + chatId,
                new MessageEvent<>(MessageEventType.MESSAGE_SENT, message)
        );
    }

    @MessageMapping("/chat.deleteMessage/{chatId}")
    
    public void deleteMessage(
            @DestinationVariable UUID chatId,
            @Payload UUID messageId,
            Principal principal
    ) {
        UUID currentUserId = ((UserDetailsImpl) ((Authentication) principal).getPrincipal()).getUser().getId();
        messageService.deleteMessage(currentUserId, chatId, messageId);

        simpMessagingTemplate.convertAndSend(
                "/topic/chat/" + chatId,
                new MessageEvent<>(MessageEventType.MESSAGE_DELETED, messageId)
        );
    }
}
