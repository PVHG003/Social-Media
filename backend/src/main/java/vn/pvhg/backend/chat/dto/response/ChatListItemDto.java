package vn.pvhg.backend.chat.dto.response;

import vn.pvhg.backend.chat.enums.ChatType;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for {@link vn.pvhg.backend.chat.model.Chat}
 */
public record ChatListItemDto(
        UUID id,
        String displayChatName,
        String displayChatImageUrl, // group image or other user’s profile
        String lastMessageContent,
        LocalDateTime lastMessageSentAt,
        String lastMessageSenderName,
        long unreadCount,
        ChatType chatType
) implements Serializable {
}