package vn.pvhg.backend.user.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class VerificationCodeRequestDTO {
    @JsonProperty("verification_code")
    @NotBlank(message = "Mã OTP không được để trống")
    private String verificationCode;
}
