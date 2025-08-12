package vn.pvhg.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.pvhg.backend.dto.request.RegisterRequest;
import vn.pvhg.backend.dto.response.UserResponse;
import vn.pvhg.backend.model.user.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest registerRequest);

    UserResponse toUserResponse(User user);
}
