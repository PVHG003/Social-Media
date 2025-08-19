package vn.pvhg.backend.chat.dto.message;

import vn.pvhg.backend.chat.dto.response.AttachmentResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OutgoingMessage(
        UUID messageId,
        UUID senderId,
        String senderUsername,
        String senderProfileImage,
        String content,
        List<AttachmentResponse> attachments,
        LocalDateTime sentAt,
        boolean deleted,
        boolean fromMe
) {
}
