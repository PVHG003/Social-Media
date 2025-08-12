package vn.pvhg.backend.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
