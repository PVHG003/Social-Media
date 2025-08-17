package vn.pvhg.backend.post.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.like.model.Like;
import vn.pvhg.backend.like.repository.LikeRepository;
import vn.pvhg.backend.post.service.MediaService;
import vn.pvhg.backend.post.dto.request.PostRequestDto;
import vn.pvhg.backend.post.dto.request.PostUpdateDto;
import vn.pvhg.backend.post.dto.response.PostResponseDto;
import vn.pvhg.backend.post.model.Post;
import vn.pvhg.backend.post.model.PostMedia;
import vn.pvhg.backend.post.model.User;
import vn.pvhg.backend.post.repository.PostRepository;
import vn.pvhg.backend.post.repository.UserRepository;
import vn.pvhg.backend.post.service.PostService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final MediaService mediaService;

    @Override
    @Transactional
    public PostResponseDto createPost(PostRequestDto requestDto, UUID userId) {
        User user = getUserById(userId);

        Post post = Post.builder()
                .content(requestDto.getContent())
                .user(user)
                .build();

        if (requestDto.getMediaFiles() != null && !requestDto.getMediaFiles().isEmpty()) {
            List<PostMedia> mediaList = mediaService.saveMultipleMedia(requestDto.getMediaFiles());
            mediaList.forEach(media -> media.setPost(post));
            post.setPostMedias(mediaList);
        } else {
            post.setPostMedias(new ArrayList<>());
        }

        Post savedPost = postRepository.save(post);
        log.info("Created post with ID: {}", savedPost.getId());

        return convertToResponseDto(savedPost, userId);
    }

    @Override
    public PostResponseDto getPostById(UUID postId, UUID currentUserId) {
        Post post = getPostByIdOrThrow(postId);
        return convertToResponseDto(post, currentUserId);
    }

    @Override
    public Page<PostResponseDto> getAllPosts(Pageable pageable, UUID currentUserId) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(post -> convertToResponseDto(post, currentUserId));
    }

    @Override
    public Page<PostResponseDto> getPostsByUserId(UUID userId, Pageable pageable, UUID currentUserId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(post -> convertToResponseDto(post, currentUserId));
    }

    @Override
    @Transactional
    public PostResponseDto updatePost(UUID postId, PostUpdateDto updateDto, UUID userId) {
        Post post = getPostByIdOrThrow(postId);

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own posts");
        }

        post.setContent(updateDto.getContent());
        Post updatedPost = postRepository.save(post);

        log.info("Updated post with ID: {}", postId);
        return convertToResponseDto(updatedPost, userId);
    }

    @Override
    @Transactional
    public void deletePost(UUID postId, UUID userId) {
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
    public PostResponseDto likePost(UUID postId, UUID userId) {
        Post post = getPostByIdOrThrow(postId);
        User user = getUserById(userId);

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
    public PostResponseDto unlikePost(UUID postId, UUID userId) {
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

    private PostResponseDto convertToResponseDto(Post post, UUID currentUserId) {
        boolean isLiked = currentUserId != null &&
                likeRepository.existsByUserIdAndPostId(currentUserId, post.getId());

        return PostResponseDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .author(PostResponseDto.UserDto.builder()
                        .id(post.getUser().getId())
                        .username(post.getUser().getUsername())
                        .email(post.getUser().getEmail())
                        .build())
                .mediaFiles(convertMediaToDto(post.getPostMedias()))
                .likeCount(post.getLikes() != null ? post.getLikes().size() : 0)
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .isLiked(isLiked)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private List<PostResponseDto.MediaDto> convertMediaToDto(List<PostMedia> mediaList) {
        if (mediaList == null || mediaList.isEmpty()) {
            return new ArrayList<>();
        }
        return mediaList.stream()
                .filter(media -> !media.isDeleted())
                .map(media -> PostResponseDto.MediaDto.builder()
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