package vn.pvhg.backend.dto.request.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @JsonProperty("email")
        @NotBlank(message = "Email cannot be blank")
        @Email(message = "Invalid email format")
        String email,

        @JsonProperty("password")
        @NotBlank(message = "Password cannot be blank")
        String password
) {
}
