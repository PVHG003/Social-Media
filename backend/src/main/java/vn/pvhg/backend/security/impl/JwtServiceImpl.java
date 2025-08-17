package vn.pvhg.backend.security.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.security.JwtService;
import vn.pvhg.backend.user.dto.response.TokenResponseDTO;
import vn.pvhg.backend.user.model.User;
import vn.pvhg.backend.utils.AuthConstant;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Duration;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final RedisTemplate<String, String> redisTemplate;

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    private final String JWT_PREFIX = "jwt:";

    @Override
    public String generateToken(User user, AuthConstant.TokenSubject subject) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.RS256);

        Duration expirationTime = subject.getDuration();
        Date expirationDate = new Date(System.currentTimeMillis() + expirationTime.toMillis());

        Date now = new Date();

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .issuer("Social Media")
                .subject(subject.getValue())
                .expirationTime(expirationDate)
                .issueTime(now)
                .claim("userId", user.getId())
                .claim("email", user.getEmail())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try{
            jwsObject.sign(new RSASSASigner(privateKey));
            String token = jwsObject.serialize();

            if(subject == AuthConstant.TokenSubject.USER_ACCESS ||
            subject == AuthConstant.TokenSubject.ADMIN_ACCESS){
                String redisKey = JWT_PREFIX + user.getId();
                redisTemplate.opsForValue().set(redisKey, token, expirationTime);
            }
            return token;
        } catch (JOSEException e){
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteToken(Long userId) {
        String redisKey = JWT_PREFIX + userId;
        redisTemplate.delete(redisKey);
    }

    @Override
    public TokenResponseDTO getToken(String token) {
        JWTClaimsSet jwtClaimsSet = getClaimsFromToken(token);
        if(jwtClaimsSet == null){
            return null;
        }
        try{
            return TokenResponseDTO.builder()
                    .subject(jwtClaimsSet.getSubject())
                    .userId(jwtClaimsSet.getLongClaim("userId"))
                    .email(jwtClaimsSet.getStringClaim("email"))
                    .token(token)
                    .build();
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean validateToken(String token) {
        try{
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new RSASSAVerifier((RSAPublicKey) this.publicKey);

            boolean isSignatureValid = signedJWT.verify(verifier);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean isExpired = expirationTime.before(new Date());

            if(!isSignatureValid || isExpired){
                return false;
            }

            String subject = signedJWT.getJWTClaimsSet().getSubject();
            if(AuthConstant.TokenSubject.USER_ACCESS.getValue().equals(subject) ||
            AuthConstant.TokenSubject.ADMIN_ACCESS.getValue().equals(subject)){
                Long userId = signedJWT.getJWTClaimsSet().getLongClaim("userId");
                String redisKey = JWT_PREFIX + userId;
                boolean keyExists = redisTemplate.hasKey(redisKey);
                if(!keyExists){
                    return false;
                }
            }
            return true;
        } catch (JOSEException | ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getEmailFromToken(String token) {
        JWTClaimsSet jwtClaimsSet = getClaimsFromToken(token);
        if(jwtClaimsSet != null){
            try{
                return jwtClaimsSet.getStringClaim("email");
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    private JWTClaimsSet getClaimsFromToken(String token) {
        if(validateToken(token)){
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
