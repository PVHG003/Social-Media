package vn.pvhg.backend.auth.dto.response;

public record UserResponse(
        Long id,
        String profileImage,
        String coverImage,
        String username
) {
}
