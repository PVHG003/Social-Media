package vn.pvhg.backend.dto.message;

import java.io.Serializable;

public record EmailMessage (String toEmail, String otpCode) implements Serializable {}
