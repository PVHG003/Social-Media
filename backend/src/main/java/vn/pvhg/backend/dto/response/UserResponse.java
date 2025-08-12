package vn.pvhg.backend.dto.response;

public record UserResponse(
        Long id,
        String profileImage,
        String coverImage,
        String username
) {
}
