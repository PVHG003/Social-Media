package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.dto.request.UserUpdateRequest;
import vn.pvhg.backend.dto.response.UserResponse;
import vn.pvhg.backend.exception.BadRequestException;
import vn.pvhg.backend.exception.share.ResourceNotFoundException;
import vn.pvhg.backend.mapper.FollowMapper;
import vn.pvhg.backend.mapper.UserMapper;
import vn.pvhg.backend.model.Follow;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.repository.FollowRepository;
import vn.pvhg.backend.repository.UserRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final UserMapper userMapper;
    private final FollowMapper followMapper;

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
    public UserResponse getUserProfile(Long userId) {
        User targetUser = findUserById(userId);
        User currentUser = getCurrentUserEntity();

        boolean isFollowing = !currentUser.getId().equals(userId) &&
                followRepository.existsByFollowerAndFollowing(currentUser, targetUser);

        long followersCount = followRepository.countByFollowing(targetUser);
        long followingCount = followRepository.countByFollower(targetUser);

        return userMapper.toUserResponse(targetUser, isFollowing, followersCount, followingCount);
    }

    @Override
    public Page<UserResponse> getFollowers(Long userId, Pageable pageable) {
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
    public Page<UserResponse> getFollowing(Long userId, Pageable pageable) {
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
    public void followUser(Long userId) {
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
    public void unfollowUser(Long userId) {
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

    // ----- Helper Methods -----
    private User getCurrentUserEntity() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getUser();
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateFollowRequest(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new BadRequestException("Cannot follow/unfollow yourself");
        }
    }

    private void validateSearchQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new BadRequestException("Search query cannot be empty");
        }
    }
}

