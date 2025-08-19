package vn.pvhg.backend.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import vn.pvhg.backend.auth.dto.request.RegisterRequest;
import vn.pvhg.backend.auth.dto.response.UserResponse;
import vn.pvhg.backend.auth.model.User;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    User toEntity(RegisterRequest request);

    UserResponse toResponse(User user);
}
