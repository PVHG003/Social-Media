package vn.pvhg.backend.dto.message;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import vn.pvhg.backend.dto.response.chat.AttachmentResponse;

public record OutgoingMessage(
        UUID messageId,
        UUID senderId,
        String senderUsername,
        String senderProfileImage,
        String content,
        List<AttachmentResponse> attachments,
        Instant sentAt,
        boolean deleted,
        boolean fromMe
) {
}
