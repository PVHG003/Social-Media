package vn.pvhg.backend.dto.response.chat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ChatMessageResponse(
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