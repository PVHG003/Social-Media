package vn.pvhg.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import vn.pvhg.backend.chat.dto.message.MessageEvent;
import vn.pvhg.backend.chat.dto.message.OutgoingMessage;
import vn.pvhg.backend.chat.dto.payload.MessagePayload;
import vn.pvhg.backend.chat.enums.MessageEventType;
import vn.pvhg.backend.chat.model.Message;
import vn.pvhg.backend.chat.service.MessageService;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final MessageService messageService;

    @MessageMapping("/chat.sendMessage.{chatId}")
    public void sendMessage(
            @DestinationVariable UUID chatId,
            @Payload MessagePayload messagePayload,
            Principal principal
    ) {
        UserDetailsImpl user = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());
        UUID currentUserId = user.getUser().getId();

        OutgoingMessage outgoingMessage = messageService.saveMessage(currentUserId, chatId, messagePayload);

        String topic = "/topic/chat/" + chatId;
        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_SENT, outgoingMessage)
        );
    }

    @MessageMapping("/message.deleteMessage.{messageId}")
    public void deleteMessage(
            @DestinationVariable UUID messageId,
            Principal principal
    ) {
        UserDetailsImpl user = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());
        UUID currentUserId = user.getUser().getId();

        Message message = Message.builder().id(messageId).build();

        String topic = "/topic/chat/" + message.getChat().getId();
        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_DELETED, null)
        );
    }

    @MessageMapping("/message.updateMessage.{messageId}")
    public void updateMessage(
            @DestinationVariable UUID messageId,
            @Payload MessagePayload messageUpdatePayload,
            Principal principal
    ) {
        UserDetailsImpl user = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());
        String username = user.getUser().getUsername();

        Message message = Message.builder().id(messageId).build();

        String topic = "/topic/chat/" + message.getChat().getId();

        OutgoingMessage updatedMessage = null;

        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_UPDATED, updatedMessage)
        );
    }

    @MessageMapping("/chat.typingMessage.{chatId}")
    public void typingMessage(
            @DestinationVariable UUID chatId,
            Principal principal
    ) {
        UserDetailsImpl user = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(principal.getName());
        String username = user.getUser().getUsername();

        String topic = "/topic/chat/" + chatId;
        String sampleText = username + " is typing ...";
        messagingTemplate.convertAndSend(
                topic,
                new MessageEvent<>(MessageEventType.MESSAGE_TYPING, sampleText)
        );
    }

}
