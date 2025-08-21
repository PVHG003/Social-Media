package vn.pvhg.backend.dto.message;

import vn.pvhg.backend.dto.response.chat.AttachmentResponse;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OutgoingMessage(
        UUID messageId,
        Long senderId,
        String senderUsername,
        String senderProfileImage,
        String content,
        List<AttachmentResponse> attachments,
        LocalDateTime sentAt,
        boolean deleted,
        boolean fromMe
) {
}
