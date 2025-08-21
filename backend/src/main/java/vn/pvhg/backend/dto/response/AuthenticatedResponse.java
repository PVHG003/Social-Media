package vn.pvhg.backend.dto.response;

public record AuthenticatedResponse(
        String subject,
        Long userId,
        String email,
        String role,
        String token
) {
}
