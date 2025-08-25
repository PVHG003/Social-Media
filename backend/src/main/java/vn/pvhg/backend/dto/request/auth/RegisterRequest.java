package vn.pvhg.backend.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Username cannot be blank")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        @Pattern(
                regexp = "^[a-zA-Z0-9._-]+$",
                message = "Username can only contain letters, numbers, dots, underscores, and hyphens"
        )
        String username,

        @NotBlank(message = "First name cannot be blank")
        @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
        String lastName,


        @JsonProperty("email")
        @Email(message = "Email must be in a valid format")
        @NotBlank(message = "Email cannot be blank")
        @Size(min = 1, max = 100, message = "Email must not exceed 100 characters")
        String email,

        @JsonProperty("password")
        @NotBlank(message = "Password cannot be blank")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
                message = "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
        )
        String password,

        @JsonProperty("confirm_password")
        @NotBlank(message = "Confirm password cannot be blank")
        String confirmPassword
) {
}
