package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.dto.request.post.CommentRequestDto;
import vn.pvhg.backend.dto.request.post.CommentUpdateDto;
import vn.pvhg.backend.dto.response.CommentResponseDto;
import vn.pvhg.backend.model.Post;
import vn.pvhg.backend.model.interaction.Comment;
import vn.pvhg.backend.repository.CommentRepository;
import vn.pvhg.backend.repository.PostRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.CommentService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public CommentResponseDto createComment(UUID postId, CommentRequestDto requestDto, UserDetailsImpl userDetails) {
        Post post = getPostByIdOrThrow(postId);
        var user = userDetails.getUser();

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
        getPostByIdOrThrow(postId);
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable)
                .map(this::convertToResponseDto);
    }

    @Override
    public Page<CommentResponseDto> getCommentsByUserId(Long userId, Pageable pageable) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToResponseDto);
    }

    @Override
    @Transactional
    public CommentResponseDto updateComment(UUID commentId, CommentUpdateDto updateDto, UserDetailsImpl userDetails) {
        Comment comment = getCommentByIdOrThrow(commentId);
        var userId = userDetails.getUser().getId();

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
    public void deleteComment(UUID commentId, UserDetailsImpl userDetails) {
        Comment comment = getCommentByIdOrThrow(commentId);
        var userId = userDetails.getUser().getId();

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

