package vn.pvhg.backend.dto.request;

public record RegisterRequest(
        String email,
        String password,
        String confirmPassword,
        String username,
        String birthday
) {
}
