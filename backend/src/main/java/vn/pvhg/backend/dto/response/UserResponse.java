package vn.pvhg.backend.dto.response;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
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
