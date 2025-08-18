package vn.pvhg.backend.chat.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AttachmentResponse(
        UUID attachmentId,
        String filePath,
        String contentType,
        UUID uploaderId,
        LocalDateTime uploadedAt
) {
}
