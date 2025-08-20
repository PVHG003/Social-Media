package vn.pvhg.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
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

        @JsonProperty("confirmPassword")
        @NotBlank(message = "Confirm password cannot be blank")
        String confirmPassword
) {
}
