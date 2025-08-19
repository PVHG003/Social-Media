package vn.pvhg.backend.comment.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.comment.dto.request.CommentRequestDto;
import vn.pvhg.backend.comment.dto.request.CommentUpdateDto;
import vn.pvhg.backend.comment.dto.response.CommentResponseDto;
import vn.pvhg.backend.comment.service.CommentService;

import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CommentRequestDto requestDto,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            CommentResponseDto response = commentService.createComment(postId, requestDto, userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error creating comment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponseDto> getComment(@PathVariable UUID commentId) {
        try {
            CommentResponseDto response = commentService.getCommentById(commentId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting comment: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<Page<CommentResponseDto>> getCommentsByPost(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CommentResponseDto> response = commentService.getCommentsByPostId(postId, pageable);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting comments by post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/{userId}/comments")
    public ResponseEntity<Page<CommentResponseDto>> getCommentsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CommentResponseDto> response = commentService.getCommentsByUserId(userId, pageable);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting comments by user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable UUID commentId,
            @Valid @RequestBody CommentUpdateDto updateDto,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            CommentResponseDto response = commentService.updateComment(commentId, updateDto, userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error updating comment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID commentId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            commentService.deleteComment(commentId, userId);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Error deleting comment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    private UUID extractUserIdFromToken(String token) {
        // TODO: Implement JWT token parsing
        // Temporary return for testing
        if (token == null || token.isEmpty()) {
            return UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
        }
        return UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
    }
}