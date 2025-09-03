package vn.pvhg.backend.dto.response;

import vn.pvhg.backend.enums.Role;

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
        Role role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean isFollowing,
        long followersCount,
        long followingCount
) {
}
