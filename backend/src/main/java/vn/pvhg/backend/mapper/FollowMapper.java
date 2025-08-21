package vn.pvhg.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.pvhg.backend.model.Follow;
import vn.pvhg.backend.model.User;

@Mapper(componentModel = "spring")
public interface FollowMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "follower", source = "follower")
    @Mapping(target = "following", source = "following")
    Follow createFollow(User follower, User following);
}