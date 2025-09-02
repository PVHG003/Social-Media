package vn.pvhg.backend.dto.response.chat;

import vn.pvhg.backend.enums.ChatType;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ChatListResponse(
        UUID chatId,
        String chatDisplayName,
        String chatDisplayImage,
        ChatType chatType,
        String lastMessage,
        String lastMessageSenderUsername,
        Instant lastMessageSentAt,
        int unreadMessagesCount,
        boolean muted,
        List<UUID> memberIds,
        LocalDateTime createdAt
) {
}