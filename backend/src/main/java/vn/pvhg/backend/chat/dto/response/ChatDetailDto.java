package vn.pvhg.backend.chat.dto.response;

import vn.pvhg.backend.chat.enums.ChatType;

import java.util.List;
import java.util.UUID;

/**
 * DTO for{@link vn.pvhg.backend.chat.model.Chat}
 */
public record ChatDetailDto(
        UUID chatId,
        ChatType chatType,
        String displayName,
        String displayImageUrl,
        List<ChatParticipantDto> participants
) {
}