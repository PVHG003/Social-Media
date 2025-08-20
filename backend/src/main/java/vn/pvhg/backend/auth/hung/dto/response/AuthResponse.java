package vn.pvhg.backend.auth.hung.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
