package vn.pvhg.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.request.UserUpdateRequest;
import vn.pvhg.backend.dto.response.UserResponse;

import java.util.UUID;

public interface UserService {
    UserResponse getCurrentUser();

    UserResponse updateUser(UserUpdateRequest request);

    UserResponse getUserProfile(UUID userId);

    Page<UserResponse> getFollowers(UUID userId, Pageable pageable);

    Page<UserResponse> getFollowing(UUID userId, Pageable pageable);

    void followUser(UUID userId);

    void unfollowUser(UUID userId);

    Page<UserResponse> searchUsers(String q, Pageable pageable);

    UserResponse uploadProfileImage(MultipartFile file);

    UserResponse uploadCoverImage(MultipartFile file);

    void deleteUser(UUID userId);

    Page<UserResponse> getAllUsers(Pageable pageable);
}
