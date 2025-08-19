package vn.pvhg.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@ConfigurationProperties(prefix = "jwt.key")
public record JwtKeyProperties(
        RSAPublicKey publicKey,
        RSAPrivateKey privateKey
) {
}