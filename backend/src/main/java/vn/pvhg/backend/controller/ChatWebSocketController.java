package vn.pvhg.backend.controller;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Controller;
import vn.pvhg.backend.dto.chat.ChatMessage;
import vn.pvhg.backend.dto.chat.MessageResponse;
import vn.pvhg.backend.model.chat.ChatRoom;
import vn.pvhg.backend.model.chat.Message;
import vn.pvhg.backend.model.media.Attachment;
import vn.pvhg.backend.model.user.User;
import vn.pvhg.backend.repository.ChatRoomRepository;
import vn.pvhg.backend.repository.MessageRepository;
import vn.pvhg.backend.repository.UserRepository;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId, @Payload ChatMessage chatMessage) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));
        User user = userRepository.findById(chatMessage.senderId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!chatRoom.getMembers().contains(user)) {
            throw new AccessDeniedException("User is not part of this chat room");
        }

        Message message = Message.builder()
                .chatRoom(chatRoom)
                .sender(user)
                .content(chatMessage.content())
                .isRead(false)
                .build();

        List<Attachment> attachments = chatMessage.attachments().stream()
                .map(url -> Attachment.builder()
                        .url(url)
                        .message(message)
                        .build())
                .toList();

        message.setAttachments(attachments);

        Message savedMessage = messageRepository.save(message);

        simpMessagingTemplate.convertAndSend(
                "/topic/chat/" + roomId,
                new MessageResponse(
                        savedMessage.getId(),
                        new MessageResponse.ChatRoomDto(
                                chatRoom.getId(),
                                chatRoom.getType(),
                                chatRoom.getName(),
                                chatRoom.getCoverImage()
                        ),
                        new MessageResponse.UserDto(
                                user.getId(),
                                user.getCoverImage(),
                                user.getUsername()
                        ),
                        attachments.stream()
                                .map(attachment -> new MessageResponse.AttachmentDto(
                                        attachment.getId(),
                                        attachment.getUrl(),
                                        attachment.getType()
                                ))
                                .toList(),
                        savedMessage.isRead(),
                        savedMessage.getSentAt()
                ));
    }
}
