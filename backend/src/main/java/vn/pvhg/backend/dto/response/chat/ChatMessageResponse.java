package vn.pvhg.backend.dto.response.chat;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ChatMessageResponse(
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