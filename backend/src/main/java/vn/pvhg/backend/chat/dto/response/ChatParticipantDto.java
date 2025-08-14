package vn.pvhg.backend.chat.dto.response;

import java.util.UUID;

public record ChatParticipantDto(
        UUID userId,
        String username,
        String profileImageUrl,
        boolean isAdmin
) {
}
