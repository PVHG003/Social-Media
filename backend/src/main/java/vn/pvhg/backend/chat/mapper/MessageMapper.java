package vn.pvhg.backend.chat.mapper;

import org.springframework.stereotype.Service;
import vn.pvhg.backend.chat.dto.message.OutgoingMessage;
import vn.pvhg.backend.chat.dto.response.ChatMessageResponse;
import vn.pvhg.backend.chat.model.Message;

import java.util.UUID;

@Service
public class MessageMapper {
    private final AttachmentMapper attachmentMapper;

    public MessageMapper(AttachmentMapper attachmentMapper) {
        this.attachmentMapper = attachmentMapper;
    }

    public ChatMessageResponse toChatMessageResponse(UUID currentUserId, Message message) {
        return new ChatMessageResponse(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getSender().getProfileImage(),
                message.getContent(),
                message.getAttachments().stream()
                        .map(attachmentMapper::toAttachmentResponse)
                        .toList(),
                message.getSentAt(),
                message.isDeleted(),
                message.getSender().getId().equals(currentUserId)
        );
    }

    public OutgoingMessage toOutgoingMessage(UUID currentUserId, Message message) {
        return new OutgoingMessage(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getSender().getProfileImage(),
                message.getContent(),
                message.getAttachments().stream()
                        .map(attachmentMapper::toAttachmentResponse)
                        .toList(),
                message.getSentAt(),
                message.isDeleted(),
                !message.getSender().getId().equals(currentUserId)
        );
    }
}
