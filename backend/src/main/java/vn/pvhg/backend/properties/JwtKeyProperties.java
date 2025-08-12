package vn.pvhg.backend.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@ConfigurationProperties(prefix = "jwt.key")
public record JwtKeyProperties(
        RSAPublicKey publicKey,
        RSAPrivateKey privateKey
) {
}
