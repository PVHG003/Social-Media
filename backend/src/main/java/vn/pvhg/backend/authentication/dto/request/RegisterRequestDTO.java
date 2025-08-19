package vn.pvhg.backend.authentication.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class RegisterRequestDTO {
    @JsonProperty("email")
    @Email(message = "Email không đúng định dạng")
    @NotBlank(message = "Email không được để trống")
    @Size(min = 1, max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;

    @JsonProperty("password")
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, max = 100, message = "Mật khẩu phải có từ 8 đến 100 kí tự")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
            message = "Mật khẩu mới phải chứa ít nhất một ký tự thường, một ký tự viết hoa và một chữ số")
    private String password;
}
