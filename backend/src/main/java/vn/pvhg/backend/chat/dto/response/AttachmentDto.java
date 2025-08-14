package vn.pvhg.backend.chat.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import vn.pvhg.backend.chat.enums.MediaType;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link vn.pvhg.backend.chat.model.Attachment}
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record AttachmentDto(
        UUID id,
        String fileName,
        String filePath,
        MediaType mediaType,
        LocalDateTime uploadedAt
) implements Serializable {
}