package vn.pvhg.backend.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password cannot be blank")
        String current_password,

        @NotBlank(message = "New password cannot be blank")
        @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "New password must contain at least one lowercase letter, one uppercase letter, and one digit"
        )
        String new_password,

        @NotBlank(message = "Confirm password cannot be blank")
        String confirm_password
) {
}
