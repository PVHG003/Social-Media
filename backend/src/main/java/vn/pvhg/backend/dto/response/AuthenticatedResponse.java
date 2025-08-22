package vn.pvhg.backend.dto.response;

import java.util.UUID;

public record AuthenticatedResponse(
        String subject,
        UUID userId,
        String email,
        String role,
        String token
) {
}
