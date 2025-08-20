package vn.pvhg.backend.utils.hung;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    private final JwtEncoder jwtEncoder;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(UUID id, Authentication authentication) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(expiration);
        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .claim("uuid", id)
                .subject(authentication.getName())
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .expiresAt(expiry)
                .claim("authorities", authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList())
                .build();
        JwtEncoderParameters parameters = JwtEncoderParameters.from(jwtClaimsSet);
        Jwt encoded = jwtEncoder.encode(parameters);
        return encoded.getTokenValue();
    }

}