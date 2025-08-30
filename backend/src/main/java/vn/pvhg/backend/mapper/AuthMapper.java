package vn.pvhg.backend.mapper;

import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;

import java.util.UUID;

@Component
public class AuthMapper {

    public AuthenticatedResponse toAuthenticatedResponse(JWTClaimsSet claim, String accessToken, String refreshToken) {
        try {
            return new AuthenticatedResponse(
                    claim.getSubject(),
                    UUID.fromString(claim.getStringClaim("userId")),
                    claim.getStringClaim("email"),
                    claim.getStringClaim("role"),
                    accessToken,
                    refreshToken
            );
        } catch (java.text.ParseException e) {
            throw new RuntimeException("Failed to parse JWT claims", e);
        }
    }

}
