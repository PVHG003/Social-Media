package vn.pvhg.backend.controller;

import java.security.Principal;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.pvhg.backend.dto.message.MessageEvent;
import vn.pvhg.backend.dto.message.OutgoingMessage;
import vn.pvhg.backend.dto.payload.MessagePayload;
import vn.pvhg.backend.enums.MessageEventType;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;
import vn.pvhg.backend.service.MessageService;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @MessageMapping("/chat/send/{chatId}")
    public void sendMessage(
            @DestinationVariable UUID chatId,
            @Payload MessagePayload messagePayload,
            Principal principal
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());

        OutgoingMessage outgoingMessage = messageService.saveMessage(userDetails, chatId, messagePayload);

        String topic = "/topic/chat/" + chatId;
        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_SENT, outgoingMessage)
        );
    }

    @MessageMapping("/chat/{chatId}/message/{messageId}/delete")
    public void deleteMessage(
            @DestinationVariable UUID chatId,
            @DestinationVariable UUID messageId,
            Principal principal
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());

        OutgoingMessage outgoingMessage = messageService.deleteMessage(userDetails, messageId);

        String topic = "/topic/chat/" + chatId;
        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_DELETED, outgoingMessage)
        );
    }

    @MessageMapping("/chat/{chatId}/message/{messageId}/update")
    public void updateMessage(
            @DestinationVariable UUID chatId,
            @DestinationVariable UUID messageId,
            @Payload MessagePayload messagePayload,
            Principal principal
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());

        String topic = "/topic/chat/" + chatId;

        OutgoingMessage updatedMessage = messageService.updateMessage(userDetails, messageId, messagePayload);

        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_UPDATED, updatedMessage)
        );
    }

    @MessageMapping("/chat/{chatId}/typing")
    public void typingMessage(
            @DestinationVariable UUID chatId,
            Principal principal
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());

        String topic = "/topic/chat/" + chatId;
        String sampleText = userDetails.getUser().getUsername() + " is typing ...";
        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_TYPING, sampleText)
        );
    }
}