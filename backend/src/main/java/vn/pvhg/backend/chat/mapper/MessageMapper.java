package vn.pvhg.backend.chat.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.chat.dto.response.AttachmentDto;
import vn.pvhg.backend.chat.dto.response.MessageDto;
import vn.pvhg.backend.chat.model.Message;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageMapper {

    public MessageDto toMessageDto(UUID userId, Message message) {
        return new MessageDto(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getUsername(),
                message.getSender().getProfileImage(),
                message.getContent(),
                message.getAttachments() == null ? null : message.getAttachments().stream()
                        .map(attachment -> new AttachmentDto(
                                attachment.getId(),
                                attachment.getFileName(),
                                attachment.getFilePath(),
                                attachment.getUploader().getId(),
                                attachment.getMediaType(),
                                attachment.getUploadedAt()
                        ))
                        .toList(),
                message.getState(),
                message.getSentAt(),
                message.getSender().getId().equals(userId),
                message.isDeleted()
        );
    }
}
