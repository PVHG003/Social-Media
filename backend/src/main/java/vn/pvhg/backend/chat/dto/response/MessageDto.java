package vn.pvhg.backend.chat.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import vn.pvhg.backend.chat.enums.MessageState;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO for {@link vn.pvhg.backend.chat.model.Message}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record MessageDto(
        UUID messageId,
        UUID senderId,
        String senderName,
        String senderProfileImageUrl,
        String content,
        List<AttachmentDto> attachments,
        MessageState state,
        LocalDateTime sentAt,
        boolean isOwner, // derived from token vs senderId
        boolean isDeleted
) {
}
