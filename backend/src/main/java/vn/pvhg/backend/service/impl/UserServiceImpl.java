package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.request.UserUpdateRequest;
import vn.pvhg.backend.dto.response.UserResponse;
import vn.pvhg.backend.exception.BadRequestException;
import vn.pvhg.backend.exception.chat.FileCreationException;
import vn.pvhg.backend.exception.chat.InvalidFileException;
import vn.pvhg.backend.exception.share.ResourceNotFoundException;
import vn.pvhg.backend.mapper.FollowMapper;
import vn.pvhg.backend.mapper.UserMapper;
import vn.pvhg.backend.model.Follow;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.repository.FollowRepository;
import vn.pvhg.backend.repository.UserRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.UserService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final UserMapper userMapper;
    private final FollowMapper followMapper;

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    @Override
    public UserResponse getCurrentUser() {
        User currentUser = getCurrentUserEntity();
        long followersCount = followRepository.countByFollowing(currentUser);
        long followingCount = followRepository.countByFollower(currentUser);

        return userMapper.toUserResponse(currentUser, false, followersCount, followingCount);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UserUpdateRequest request) {
        User currentUser = getCurrentUserEntity();

        // Directly update fields from request
        if (request.username() != null) currentUser.setUsername(request.username());
        if (request.firstName() != null) currentUser.setFirstName(request.firstName());
        if (request.lastName() != null) currentUser.setLastName(request.lastName());
        if (request.bio() != null) currentUser.setBio(request.bio());

        User updatedUser = userRepository.save(currentUser);

        long followersCount = followRepository.countByFollowing(updatedUser);
        long followingCount = followRepository.countByFollower(updatedUser);

        return userMapper.toUserResponse(updatedUser, false, followersCount, followingCount);
    }

    @Override
    public UserResponse getUserProfile(UUID userId) {
        User targetUser = findUserById(userId);
        User currentUser = getCurrentUserEntity();

        boolean isFollowing = !currentUser.getId().equals(userId) &&
                followRepository.existsByFollowerAndFollowing(currentUser, targetUser);

        long followersCount = followRepository.countByFollowing(targetUser);
        long followingCount = followRepository.countByFollower(targetUser);

        return userMapper.toUserResponse(targetUser, isFollowing, followersCount, followingCount);
    }

    @Override
    public Page<UserResponse> getFollowers(UUID userId, Pageable pageable) {
        User targetUser = findUserById(userId);
        User currentUser = getCurrentUserEntity();

        Page<Follow> followersPage = followRepository.findByFollowing(targetUser, pageable);

        return followersPage.map(follow -> {
            User followerUser = follow.getFollower();

            long followersCount = followRepository.countByFollowing(followerUser);
            long followingCount = followRepository.countByFollower(followerUser);

            boolean isFollowing = !currentUser.getId().equals(followerUser.getId()) &&
                    followRepository.existsByFollowerAndFollowing(currentUser, followerUser);

            return userMapper.toUserResponse(followerUser, isFollowing, followersCount, followingCount);
        });
    }

    @Override
    public Page<UserResponse> getFollowing(UUID userId, Pageable pageable) {
        User targetUser = findUserById(userId);
        User currentUser = getCurrentUserEntity();

        Page<Follow> followingPage = followRepository.findByFollower(targetUser, pageable);

        return followingPage.map(follow -> {
            User followedUser = follow.getFollowing();

            long followersCount = followRepository.countByFollowing(followedUser);
            long followingCount = followRepository.countByFollower(followedUser);

            boolean isFollowing = !currentUser.getId().equals(followedUser.getId()) &&
                    followRepository.existsByFollowerAndFollowing(currentUser, followedUser);

            return userMapper.toUserResponse(followedUser, isFollowing, followersCount, followingCount);
        });
    }

    @Transactional
    @Override
    public void followUser(UUID userId) {
        User currentUser = getCurrentUserEntity();
        validateFollowRequest(currentUser.getId(), userId);

        User targetUser = findUserById(userId);

        if (followRepository.existsByFollowerAndFollowing(currentUser, targetUser)) {
            throw new BadRequestException("Already following this user");
        }

        Follow follow = followMapper.createFollow(currentUser, targetUser);
        followRepository.save(follow);
    }

    @Transactional
    @Override
    public void unfollowUser(UUID userId) {
        User currentUser = getCurrentUserEntity();
        validateFollowRequest(currentUser.getId(), userId);

        Follow follow = followRepository.findByFollowerIdAndFollowingId(currentUser.getId(), userId)
                .orElseThrow(() -> new BadRequestException("Not following this user"));

        followRepository.delete(follow);
    }

    @Override
    public Page<UserResponse> searchUsers(String query, Pageable pageable) {
        validateSearchQuery(query);
        User currentUser = getCurrentUserEntity();

        Page<User> users = userRepository.searchByName(query.trim(), pageable);

        return users.map(user -> {
            boolean isFollowing = !currentUser.getId().equals(user.getId()) &&
                    followRepository.existsByFollowerAndFollowing(currentUser, user);

            long followersCount = followRepository.countByFollowing(user);
            long followingCount = followRepository.countByFollower(user);

            return userMapper.toUserResponse(user, isFollowing, followersCount, followingCount);
        });
    }

    @Override
    public UserResponse uploadProfileImage(MultipartFile file) {
        User user = getCurrentUserEntity();

        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty or missing");
        }


        Path dir = makeDir(user.getId().toString(), "profile");
        String fileName = sanitizeFilename(file);
        Path target = dir.resolve(fileName);

        try {
            Files.createDirectories(dir);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            String relativePath = dir.resolve(fileName).toString();

            user.setProfileImagePath(relativePath);
            User savedUser = userRepository.save(user);

            boolean isFollowing = !savedUser.getId().equals(user.getId()) &&
                    followRepository.existsByFollowerAndFollowing(savedUser, user);

            long followersCount = followRepository.countByFollowing(user);
            long followingCount = followRepository.countByFollower(user);

            return userMapper.toUserResponse(savedUser, isFollowing, followersCount, followingCount);
        } catch (IOException e) {
            throw new FileCreationException("Failed to save profile image", e);
        }
    }

    @Override
    public UserResponse uploadCoverImage(MultipartFile file) {
        User user = getCurrentUserEntity();

        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty or missing");
        }


        Path dir = makeDir(user.getId().toString(), "cover-image");
        String fileName = sanitizeFilename(file);
        Path target = dir.resolve(fileName);

        try {
            Files.createDirectories(dir);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            String relativePath = dir.resolve(fileName).toString();

            user.setCoverImagePath(relativePath);
            User savedUser = userRepository.save(user);

            boolean isFollowing = !savedUser.getId().equals(user.getId()) &&
                    followRepository.existsByFollowerAndFollowing(savedUser, user);

            long followersCount = followRepository.countByFollowing(user);
            long followingCount = followRepository.countByFollower(user);

            return userMapper.toUserResponse(savedUser, isFollowing, followersCount, followingCount);
        } catch (IOException e) {
            throw new FileCreationException("Failed to save profile image", e);
        }

    }

    // ----- Helper Methods -----
    private User getCurrentUserEntity() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateFollowRequest(UUID currentUserId, UUID targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new BadRequestException("Cannot follow/unfollow yourself");
        }
    }

    private void validateSearchQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new BadRequestException("Search query cannot be empty");
        }
    }

    private String sanitizeFilename(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String safeName = UUID.randomUUID().toString();
        return safeName + extension;
    }

    private Path makeDir(String... subDir) {
        return Paths.get(fileUploadPath, subDir);
    }

}

