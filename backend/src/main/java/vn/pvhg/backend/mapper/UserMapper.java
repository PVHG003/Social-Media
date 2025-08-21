package vn.pvhg.backend.mapper;

import org.mapstruct.*;
import vn.pvhg.backend.dto.request.UserUpdateRequest;
import vn.pvhg.backend.dto.response.UserResponse;
import vn.pvhg.backend.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "isFollowing", source = "isFollowing")
    @Mapping(target = "followersCount", source = "followersCount")
    @Mapping(target = "followingCount", source = "followingCount")
    UserResponse toUserResponse(User user, boolean isFollowing, long followersCount, long followingCount);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateUserFromRequest(@MappingTarget User user, UserUpdateRequest request);
}
