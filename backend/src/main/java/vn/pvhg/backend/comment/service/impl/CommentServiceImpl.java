package vn.pvhg.backend.comment.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.comment.dto.request.CommentRequestDto;
import vn.pvhg.backend.comment.dto.request.CommentUpdateDto;
import vn.pvhg.backend.comment.dto.response.CommentResponseDto;
import vn.pvhg.backend.comment.model.Comment;
import vn.pvhg.backend.comment.repository.CommentRepository;
import vn.pvhg.backend.comment.service.CommentService;
import vn.pvhg.backend.post.model.Post;
import vn.pvhg.backend.post.model.User;
import vn.pvhg.backend.post.repository.PostRepository;
import vn.pvhg.backend.post.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CommentResponseDto createComment(UUID postId, CommentRequestDto requestDto, UUID userId) {
        Post post = getPostByIdOrThrow(postId);
        User user = getUserByIdOrThrow(userId);

        Comment comment = new Comment();
        comment.setContent(requestDto.getContent());
        comment.setPost(post);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        log.info("Created comment with ID: {} for post: {}", savedComment.getId(), postId);

        return convertToResponseDto(savedComment);
    }

    @Override
    public CommentResponseDto getCommentById(UUID commentId) {
        Comment comment = getCommentByIdOrThrow(commentId);
        return convertToResponseDto(comment);
    }

    @Override
    public Page<CommentResponseDto> getCommentsByPostId(UUID postId, Pageable pageable) {
        // Verify post exists
        getPostByIdOrThrow(postId);

        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable)
                .map(this::convertToResponseDto);
    }

    @Override
    public Page<CommentResponseDto> getCommentsByUserId(UUID userId, Pageable pageable) {
        // Verify user exists
        getUserByIdOrThrow(userId);

        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToResponseDto);
    }

    @Override
    @Transactional
    public CommentResponseDto updateComment(UUID commentId, CommentUpdateDto updateDto, UUID userId) {
        Comment comment = getCommentByIdOrThrow(commentId);

        // Check if user owns the comment
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only update your own comments");
        }

        comment.setContent(updateDto.getContent());
        Comment updatedComment = commentRepository.save(comment);

        log.info("Updated comment with ID: {}", commentId);
        return convertToResponseDto(updatedComment);
    }

    @Override
    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = getCommentByIdOrThrow(commentId);

        // Check if user owns the comment
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
        log.info("Deleted comment with ID: {}", commentId);
    }

    private Comment getCommentByIdOrThrow(UUID commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + commentId));
    }

    private Post getPostByIdOrThrow(UUID postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + postId));
    }

    private User getUserByIdOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
    }

    private CommentResponseDto convertToResponseDto(Comment comment) {
        return CommentResponseDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(CommentResponseDto.UserDto.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .email(comment.getUser().getEmail())
                        .build())
                .postId(comment.getPost().getId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}