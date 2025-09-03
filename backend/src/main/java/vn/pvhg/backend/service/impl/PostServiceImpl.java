package vn.pvhg.backend.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.pvhg.backend.dto.request.post.PostRequest;
import vn.pvhg.backend.dto.request.post.PostUpdateRequest;
import vn.pvhg.backend.dto.response.PostResponse;
import vn.pvhg.backend.model.Notification;
import vn.pvhg.backend.model.Post;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.model.interaction.Like;
import vn.pvhg.backend.model.media.PostMedia;
import vn.pvhg.backend.repository.FollowRepository;
import vn.pvhg.backend.repository.LikeRepository;
import vn.pvhg.backend.repository.PostRepository;
import vn.pvhg.backend.repository.UserRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.MediaService;
import vn.pvhg.backend.service.NotificationService;
import vn.pvhg.backend.service.PostService;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final MediaService mediaService;
    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PostResponse createPost(UserDetailsImpl userDetails, PostRequest requestDto) {
        User user = userDetails.getUser();
        UUID userId = user.getId();

        Post post = Post.builder()
                .content(requestDto.getContent())
                .user(user)
                .build();

        if (requestDto.getMediaFiles() != null && !requestDto.getMediaFiles().isEmpty()) {
            List<PostMedia> mediaList = mediaService.saveMultipleMedia(requestDto.getMediaFiles());
            mediaList.forEach(media -> media.setPost(post));
            post.setPostMedias(mediaList);
        }
        else {
            post.setPostMedias(new ArrayList<>());
        }

        Post savedPost = postRepository.save(post);
        log.info("Created post with ID: {}", savedPost.getId());

        List<User> followers = followRepository.findFollowersByUserId(userId);

        List<Notification> notifications = followers.stream()
                .map(follower -> Notification.builder()
                        .title("New Post")
                        .body(user.getUsername() + " has created a new post")
                        .aggregationKey("POST:" + savedPost.getId())
                        .recipient(follower)
                        .read(false)
                        .build())
                .toList();

        notificationService.createAndSendBulk(notifications);

        return convertToResponseDto(savedPost, userId);
    }

    @Override
    public PostResponse getPostById(UserDetailsImpl userDetails, UUID postId) {
        UUID currentUserId = userDetails.getUser().getId();

        Post post = getPostByIdOrThrow(postId);
        return convertToResponseDto(post, currentUserId);
    }

    @Override
    public Page<PostResponse> getAllPosts(UserDetailsImpl userDetails, Pageable pageable) {
        UUID currentUserId = userDetails.getUser().getId();
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(post -> convertToResponseDto(post, currentUserId));
    }

    @Override
    public Page<PostResponse> getPostsByUser(UserDetailsImpl userDetails, UUID userId, Pageable pageable) {
        UUID currentUserId = userDetails.getUser().getId();
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(post -> convertToResponseDto(post, currentUserId));
    }

    @Override
    @Transactional
    public PostResponse updatePost(UserDetailsImpl userDetails, UUID postId, PostUpdateRequest updateDto) {
        UUID userId = userDetails.getUser().getId();
        Post post = getPostByIdOrThrow(postId);

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own posts");
        }

        post.setContent(updateDto.content());
        Post updatedPost = postRepository.save(post);

        log.info("Updated post with ID: {}", postId);
        return convertToResponseDto(updatedPost, userId);
    }

    @Override
    @Transactional
    public void deletePost(UserDetailsImpl userDetails, UUID postId) {
        UUID userId = userDetails.getUser().getId();
        Post post = getPostByIdOrThrow(postId);

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own posts");
        }

        // Delete media files
        post.getPostMedias().forEach(media -> mediaService.deleteMedia(media.getStoragePath()));

        postRepository.delete(post);
        log.info("Deleted post with ID: {}", postId);
    }

    @Override
    @Transactional
    public PostResponse likePost(UserDetailsImpl userDetails, UUID postId) {
        Post post = getPostByIdOrThrow(postId);
        User user = userDetails.getUser();
        UUID userId = user.getId();

        boolean alreadyLiked = likeRepository.existsByUserIdAndPostId(userId, postId);
        if (alreadyLiked) {
            throw new RuntimeException("Post already liked");
        }

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        likeRepository.save(like);

        log.info("User {} liked post {}", userId, postId);
        return convertToResponseDto(post, userId);
    }

    @Override
    @Transactional
    public PostResponse unlikePost(UserDetailsImpl userDetails, UUID postId) {
        UUID userId = userDetails.getUser().getId();
        Post post = getPostByIdOrThrow(postId);

        Like like = likeRepository.findByUserIdAndPostId(userId, postId)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        likeRepository.delete(like);

        log.info("User {} unliked post {}", userId, postId);
        return convertToResponseDto(post, userId);
    }

    private Post getPostByIdOrThrow(UUID postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
    }

    private User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    private PostResponse convertToResponseDto(Post post, UUID currentUserId) {
        boolean isLiked = currentUserId != null &&
                likeRepository.existsByUserIdAndPostId(currentUserId, post.getId());

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .author(PostResponse.UserDto.builder()
                        .id(post.getUser().getId())
                        .username(post.getUser().getUsername())
                        .email(post.getUser().getEmail())
                        .profileImagePath(post.getUser().getProfileImagePath())
                        .build())
                .mediaFiles(convertMediaToDto(post.getPostMedias()))
                .likeCount(post.getLikes() != null ? post.getLikes().size() : 0)
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .isLiked(isLiked)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private List<PostResponse.MediaDto> convertMediaToDto(List<PostMedia> mediaList) {
        if (mediaList == null || mediaList.isEmpty()) {
            return new ArrayList<>();
        }
        return mediaList.stream()
                .filter(media -> !media.isDeleted())
                .map(media -> PostResponse.MediaDto.builder()
                        .id(media.getId())
                        .originalFilename(media.getOriginalFilename())
                        .publicUrl(mediaService.getPublicUrl(media.getStoragePath()))
                        .mediaType(media.getMediaType().toString())
                        .fileSize(media.getFileSize())
                        .width(media.getWidth())
                        .height(media.getHeight())
                        .duration(media.getDuration())
                        .position(media.getPosition())
                        .build())
                .collect(Collectors.toList());
    }
}
