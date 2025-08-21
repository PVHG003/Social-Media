package vn.pvhg.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String username,
        String firstName,
        String lastName,
        String bio,
        String profileImagePath,
        String coverImagePath,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean isFollowing,
        long followersCount,
        long followingCount
) {
}
