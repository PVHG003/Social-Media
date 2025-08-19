package vn.pvhg.backend.chat.dto.response;

import java.util.UUID;

public record MemberResponse(
        UUID id,
        String username,
        String profileImage
) {
}
