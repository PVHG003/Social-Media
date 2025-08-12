package vn.pvhg.backend.dto.request;

public record LoginRequest(
        String email,
        String password
) {
}
