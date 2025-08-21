package vn.pvhg.backend.service;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.dto.request.post.CommentRequestDto;
import vn.pvhg.backend.dto.request.post.CommentUpdateDto;
import vn.pvhg.backend.dto.response.CommentResponseDto;
import vn.pvhg.backend.security.UserDetailsImpl;

import java.util.UUID;

public interface CommentService {
    CommentResponseDto createComment(UUID postId, @Valid CommentRequestDto requestDto, UserDetailsImpl userDetails);

    CommentResponseDto getCommentById(UUID commentId);

    Page<CommentResponseDto> getCommentsByPostId(UUID postId, Pageable pageable);

    Page<CommentResponseDto> getCommentsByUserId(Long userId, Pageable pageable);

    CommentResponseDto updateComment(UUID commentId, @Valid CommentUpdateDto updateDto, UserDetailsImpl userDetails);

    void deleteComment(UUID commentId, UserDetailsImpl userDetails);
}
