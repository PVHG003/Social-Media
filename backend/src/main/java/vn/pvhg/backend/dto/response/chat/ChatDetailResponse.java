package vn.pvhg.backend.dto.response.chat;

import vn.pvhg.backend.enums.ChatType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ChatDetailResponse(
        UUID chatId,
        String chatDisplayName,
        String chatDisplayImage,
        ChatType chatType,
        List<MemberResponse> members,
        LocalDateTime createdAt
) {
}