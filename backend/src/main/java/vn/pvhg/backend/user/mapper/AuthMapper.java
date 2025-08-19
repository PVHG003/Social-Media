package vn.pvhg.backend.user.mapper;

import com.nimbusds.jwt.JWTClaimsSet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import vn.pvhg.backend.user.dto.request.RegisterRequestDTO;
import vn.pvhg.backend.user.dto.response.AuthResourceResponseDTO;
import vn.pvhg.backend.user.model.User;
import vn.pvhg.backend.utils.AuthConstant;

import java.text.ParseException;

@Mapper(componentModel = "spring", imports = {AuthConstant.class})
public interface AuthMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "providerId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "provider", expression = "java(AuthConstant.AuthProvider.LOCAL.getValue())")
    @Mapping(target = "isVerified", expression = "java(AuthConstant.IsVerified.UNVERIFIED.getValue())")
    @Mapping(target = "role", expression = "java(AuthConstant.Role.USER.getValue())")
    User toEntity(RegisterRequestDTO request);

    @Mapping(target = "subject", source = "claim.subject")
    @Mapping(target = "userId", source = "claim", qualifiedByName = "getUserIdFromToken")
    @Mapping(target = "email", source = "claim", qualifiedByName = "getEmailFromToken")
    @Mapping(target = "role", source = "claim", qualifiedByName = "getRoleFromToken")
    @Mapping(target = "token", source = "token")
    AuthResourceResponseDTO toAuthResourceResponseDTO(JWTClaimsSet claim, String token);

    @Named("getUserIdFromToken")
    default Long getUserIdFromToken(JWTClaimsSet claim) {
        try {
            return claim.getLongClaim("userId");
        } catch (ParseException e){
            throw new RuntimeException(e);
        }
    }

    @Named("getEmailFromToken")
    default String getEmailFromToken(JWTClaimsSet claim) {
        try{
            return claim.getStringClaim("email");
        } catch (ParseException e){
            throw new RuntimeException(e);
        }
    }

    @Named("getRoleFromToken")
    default String getRoleFromToken(JWTClaimsSet claim) {
        try{
            return claim.getStringClaim("role");
        } catch (ParseException e){
            throw new RuntimeException(e);
        }
    }
}
