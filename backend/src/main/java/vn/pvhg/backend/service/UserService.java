package vn.pvhg.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.dto.request.UserUpdateRequest;
import vn.pvhg.backend.dto.response.UserResponse;

public interface UserService {
    UserResponse getCurrentUser();

    UserResponse updateUser(UserUpdateRequest request);

    UserResponse getUserProfile(Long userId);

    Page<UserResponse> getFollowers(Long userId, Pageable pageable);

    Page<UserResponse> getFollowing(Long userId, Pageable pageable);

    void followUser(Long userId);

    void unfollowUser(Long userId);

    Page<UserResponse> searchUsers(String q, Pageable pageable);
}
