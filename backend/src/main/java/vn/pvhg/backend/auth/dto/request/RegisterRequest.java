package vn.pvhg.backend.auth.dto.request;

import java.time.LocalDate;

public record RegisterRequest(
        String email,
        String password,
        String confirmPassword,
        String username,
        String bio,
        LocalDate birthday
) {
}
