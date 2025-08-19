package vn.pvhg.backend.utils;

import java.time.Duration;

public class AuthConstant {
    public enum Role {
        ADMIN(0),
        USER(1);

        private int value;

        Role(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public enum AuthProvider{
        LOCAL(0),
        GOOGLE(1);

        private final int value;

        AuthProvider(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public enum IsVerified {
        UNVERIFIED(0),
        VERIFIED(1);

        private final int value;

        IsVerified(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public enum TokenSubject {
        USER_ACCESS("User Access"),
        ADMIN_ACCESS("Admin Access"),
        OTP_VERIFIED_ACCOUNT("OTP Verified Account"),
        OTP_RESET_PASSWORD("OTP Reset Password"),
        RESET_PASSWORD("Reset Password");

        private final String value;

        TokenSubject(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public Duration getDuration() {
            switch (this) {
                case USER_ACCESS:
                    return Duration.ofHours(1);
                case ADMIN_ACCESS:
                    return Duration.ofMinutes(30);
                case OTP_VERIFIED_ACCOUNT:
                case OTP_RESET_PASSWORD:
                case RESET_PASSWORD:
                    return Duration.ofMinutes(5);
                default:
                    return Duration.ofMinutes(1);
            }
        }
    }
}
