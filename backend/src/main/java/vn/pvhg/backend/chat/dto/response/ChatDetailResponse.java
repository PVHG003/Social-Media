package vn.pvhg.backend.chat.dto.response;

import vn.pvhg.backend.chat.enums.ChatType;

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
