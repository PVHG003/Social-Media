package vn.pvhg.backend.auth.dto.response;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String profileImage,
        String coverImage,
        String username
) {
}
