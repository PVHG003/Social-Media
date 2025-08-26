package vn.pvhg.backend.service.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.dto.response.AuthenticatedResponse;
import vn.pvhg.backend.enums.TokenSubject;
import vn.pvhg.backend.mapper.AuthMapper;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.property.RsaKeyProperties;
import vn.pvhg.backend.service.JwtService;

import java.text.ParseException;
import java.time.Duration;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private static final String JWT_ACCESS_PREFIX = "jwt:access:";
    private static final String JWT_REFRESH_PREFIX = "jwt:refresh:";
    private final RedisTemplate<String, String> redisTemplate;

    private final RsaKeyProperties rsaKeyProperties;
    private final AuthMapper authMapper;

    @Override
    public String generateToken(User user, TokenSubject subject) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.RS256);

        Duration expirationTime = subject.getDuration();
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTime.toMillis());

        Date now = new Date();

        String role = switch (user.getRole()) {
            case ADMIN -> "admin";
            case USER -> "user";
        };

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .issuer("Social Media")
                .subject(subject.getValue())
                .expirationTime(expirationDate)
                .issueTime(now)
                .claim("userId", user.getId().toString())
                .claim("email", user.getEmail())
                .claim("role", role)
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new RSASSASigner(this.rsaKeyProperties.privateKey()));
            String token = jwsObject.serialize();

            if (subject == TokenSubject.USER_ACCESS || subject == TokenSubject.ADMIN_ACCESS) {
                String redisKey = JWT_ACCESS_PREFIX + user.getId().toString();
                redisTemplate.opsForValue().set(redisKey, token, expirationTime);
            } else if (subject == TokenSubject.REFRESH_TOKEN) {
                String redisKey = JWT_REFRESH_PREFIX + user.getId().toString();
                redisTemplate.opsForValue().set(redisKey, token, expirationTime);
            }
            return token;
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteToken(UUID userId) {
        String accessKey = JWT_ACCESS_PREFIX + userId.toString();
        String refreshKey = JWT_REFRESH_PREFIX + userId.toString();
        redisTemplate.delete(accessKey);
        redisTemplate.delete(refreshKey);
    }

    @Override
    public AuthenticatedResponse getToken(String accessToken, String refreshToken) {
        JWTClaimsSet jwtClaimsSet = getClaimsFromToken(accessToken);
        if (jwtClaimsSet == null) {
            return null;
        }
        return authMapper.toAuthenticatedResponse(jwtClaimsSet, accessToken, refreshToken);
    }

    @Override
    public boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new RSASSAVerifier(this.rsaKeyProperties.publicKey());

            boolean isSignatureValid = signedJWT.verify(verifier);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean isExpired = expirationTime.before(new Date());

            if (!isSignatureValid || isExpired) {
                return false;
            }

            String userIdString = signedJWT.getJWTClaimsSet().getStringClaim("userId");
            String subject = signedJWT.getJWTClaimsSet().getSubject();
            if (TokenSubject.USER_ACCESS.getValue().equals(subject) || TokenSubject.ADMIN_ACCESS.getValue().equals(subject)) {
                String redisKey = JWT_ACCESS_PREFIX + userIdString;
                return redisTemplate.hasKey(redisKey);
            } else if (TokenSubject.REFRESH_TOKEN.getValue().equals(subject)) {
                String redisKey = JWT_REFRESH_PREFIX + userIdString;
                String storedToken = redisTemplate.opsForValue().get(redisKey);
                return token.equals(storedToken);
            }
            return true;
        } catch (JOSEException | ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getEmailFromToken(String token) {
        JWTClaimsSet jwtClaimsSet = getClaimsFromToken(token);
        if (jwtClaimsSet != null) {
            try {
                return jwtClaimsSet.getStringClaim("email");
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    private JWTClaimsSet getClaimsFromToken(String token) {
        if (validateToken(token)) {
            try {
                SignedJWT signedJWT = SignedJWT.parse(token);
                return signedJWT.getJWTClaimsSet();
            } catch (ParseException e) {
                return null;
            }
        }
        return null;
    }
}
