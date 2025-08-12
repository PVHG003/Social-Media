package vn.pvhg.backend.dto.chat;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

public record MessageResponse(
        Long id,
        ChatRoomDto chatRoom,
        UserDto sender,
        List<AttachmentDto> attachments,
        boolean isRead,
        Instant sentAt
) {

    /**
     * DTO for {@link vn.pvhg.backend.model.chat.ChatRoom}
     */
    public record ChatRoomDto(
            Long id,
            String type,
            String name,
            String coverImage
    ) implements Serializable {
    }

    /**
     * DTO for {@link vn.pvhg.backend.model.user.User}
     */
    public record UserDto(
            Long id,
            String coverImage,
            String username
    ) implements Serializable {
    }

    /**
     * DTO for {@link vn.pvhg.backend.model.media.Attachment}
     */
    public record AttachmentDto(
            Long id,
            String url,
            String type
    ) implements Serializable {
    }
}
