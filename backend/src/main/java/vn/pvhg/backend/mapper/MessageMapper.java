package vn.pvhg.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.dto.message.OutgoingMessage;
import vn.pvhg.backend.dto.response.chat.ChatMessageResponse;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.model.chat.Message;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MessageMapper {
    private final AttachmentMapper attachmentMapper;

    public ChatMessageResponse toChatMessageResponse(UUID currentUserId, Message message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getSender().getProfileImagePath(),
                message.isDeleted() ? "Message deleted" : message.getContent(),
                message.getAttachments().stream()
                        .map(attachmentMapper::toAttachmentResponse)
                        .toList(),
                message.getSentAt(),
                message.isDeleted(),
                message.getSender().getId().equals(currentUserId));
    }

    public OutgoingMessage toOutgoingMessage(User currentUser, Message message) {
        return new OutgoingMessage(
                message.getId(),
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getProfileImagePath(),
                message.isDeleted() ? "Message deleted" : message.getContent(),
                message.getAttachments().stream()
                        .map(attachmentMapper::toAttachmentResponse)
                        .toList(),
                message.getSentAt(),
                message.isDeleted(),
                !message.getSender().getId().equals(currentUser.getId()));
    }
}