package vn.pvhg.backend.auth.hung.dto.request;

public record LoginRequest(
        String email,
        String password
) {
}
