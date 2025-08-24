package vn.pvhg.backend.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordResetRequest(
        @JsonProperty("email")
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Invalid email format")
        String email,

        @JsonProperty("code")
        @NotBlank(message = "OTP cannot be blank")
        String code,

        @JsonProperty("new_password")
        @NotBlank(message = "Password must not be blank")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "New password must contain at least one lowercase letter, one uppercase letter, and one digit")
        String newPassword,

        @JsonProperty("current_password")
        @NotBlank(message = "Password must not be blank")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "New password must contain at least one lowercase letter, one uppercase letter, and one digit")
        String confirmPassword
) {
}
