package vn.pvhg.backend.auth.hung.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import vn.pvhg.backend.auth.hung.dto.request.RegisterRequest;
import vn.pvhg.backend.auth.hung.dto.response.UserResponse;
import vn.pvhg.backend.auth.hung.model.User;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);
}
