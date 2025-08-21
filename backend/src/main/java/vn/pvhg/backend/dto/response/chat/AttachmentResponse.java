package vn.pvhg.backend.dto.response.chat;


import java.time.LocalDateTime;
import java.util.UUID;

public record AttachmentResponse(
        UUID attachmentId,
        String filePath,
        String contentType,
        Long uploaderId,
        LocalDateTime uploadedAt
) {
}