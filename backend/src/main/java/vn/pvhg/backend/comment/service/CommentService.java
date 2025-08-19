package vn.pvhg.backend.comment.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.comment.dto.request.CommentRequestDto;
import vn.pvhg.backend.comment.dto.request.CommentUpdateDto;
import vn.pvhg.backend.comment.dto.response.CommentResponseDto;

import java.util.UUID;

public interface CommentService {
    CommentResponseDto createComment(UUID postId, CommentRequestDto requestDto, UUID userId);

    CommentResponseDto getCommentById(UUID commentId);

    Page<CommentResponseDto> getCommentsByPostId(UUID postId, Pageable pageable);

    Page<CommentResponseDto> getCommentsByUserId(UUID userId, Pageable pageable);

    CommentResponseDto updateComment(UUID commentId, CommentUpdateDto updateDto, UUID userId);

    void deleteComment(UUID commentId, UUID userId);
}