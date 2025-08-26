package vn.pvhg.backend.enums;

import lombok.Getter;

import java.time.Duration;

@Getter
public enum TokenSubject {
    USER_ACCESS("User Access"),
    ADMIN_ACCESS("Admin Access"),
    REFRESH_TOKEN("Refresh Token"),
    OTP_VERIFIED_ACCOUNT("OTP Verified Account"),
    OTP_RESET_PASSWORD("OTP Reset Password"),
    RESET_PASSWORD("Reset Password");

    private final String value;

    TokenSubject(String value) {
        this.value = value;
    }

    public Duration getDuration() {
        return switch (this) {
            case USER_ACCESS, ADMIN_ACCESS -> Duration.ofMinutes(15);
            case REFRESH_TOKEN -> Duration.ofDays(1);
            case OTP_VERIFIED_ACCOUNT, OTP_RESET_PASSWORD, RESET_PASSWORD -> Duration.ofMinutes(5);
        };
    }
}
