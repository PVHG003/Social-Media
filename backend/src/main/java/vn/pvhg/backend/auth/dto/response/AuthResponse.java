package vn.pvhg.backend.auth.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
