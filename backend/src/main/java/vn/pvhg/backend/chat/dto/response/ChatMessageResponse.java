package vn.pvhg.backend.chat.dto.response;

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
        LocalDateTime sentAt,
        boolean deleted,
        boolean fromMe
) {
}
