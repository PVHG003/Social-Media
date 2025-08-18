package vn.pvhg.backend.chat.dto.response;

import vn.pvhg.backend.chat.enums.ChatType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ChatListResponse(
        UUID chatId,
        String chatDisplayName,
        String chatDisplayImage,
        ChatType chatType,
        String lastMessage,
        String lastMessageSenderUsername,
        LocalDateTime lastMessageSentAt,
        int unreadMessagesCount,
        boolean muted,
        LocalDateTime createdAt
) {
}
