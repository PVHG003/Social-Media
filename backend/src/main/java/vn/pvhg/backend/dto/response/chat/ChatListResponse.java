package vn.pvhg.backend.dto.response.chat;

import vn.pvhg.backend.enums.ChatType;

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