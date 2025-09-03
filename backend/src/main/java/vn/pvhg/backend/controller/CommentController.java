package vn.pvhg.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.dto.request.post.CommentRequestDto;
import vn.pvhg.backend.dto.request.post.CommentUpdateDto;
import vn.pvhg.backend.dto.response.CommentResponseDto;
import vn.pvhg.backend.response.ApiPaginatedResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.CommentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<CommentResponseDto>> createComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CommentRequestDto requestDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            CommentResponseDto data = commentService.createComment(postId, requestDto, userDetails);
            ApiResponse<CommentResponseDto> response = new ApiResponse<>(HttpStatus.CREATED, "Comment created", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error creating comment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDto>> getComment(
            @PathVariable UUID commentId
    ) {
        try {
            CommentResponseDto data = commentService.getCommentById(commentId);
            ApiResponse<CommentResponseDto> response = new ApiResponse<>(HttpStatus.OK, "Comment retrieved", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error getting comment: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiPaginatedResponse<List<CommentResponseDto>>> getCommentsByPost(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CommentResponseDto> data = commentService.getCommentsByPostId(postId, pageable);
            ApiPaginatedResponse<List<CommentResponseDto>> response = new ApiPaginatedResponse<>(
                    HttpStatus.OK,
                    "Comments retrieved",
                    true,
                    data.getContent(),
                    page,
                    size,
                    data.getTotalPages(),
                    data.getTotalElements());
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error getting comments by post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/{userId}/comments")
    public ResponseEntity<ApiPaginatedResponse<List<CommentResponseDto>>> getCommentsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<CommentResponseDto> data = commentService.getCommentsByUserId(userId, pageable);
            ApiPaginatedResponse<List<CommentResponseDto>> response = new ApiPaginatedResponse<>(
                    HttpStatus.OK,
                    "Comments retrieved",
                    true,
                    data.getContent(),
                    page,
                    size,
                    data.getTotalPages(),
                    data.getTotalElements());
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error getting comments by user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDto>> updateComment(
            @PathVariable UUID commentId,
            @Valid @RequestBody CommentUpdateDto updateDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            CommentResponseDto data = commentService.updateComment(commentId, updateDto, userDetails);
            ApiResponse<CommentResponseDto> response = new ApiResponse<>(HttpStatus.OK, "Comment updated", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error updating comment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable UUID commentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            commentService.deleteComment(commentId, userDetails);
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK, "Comment deleted", true, null);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error deleting comment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/admin/{commentId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCommentByAdmin(@PathVariable UUID commentId) {
        commentService.deleteCommentByAdmin(commentId);
        ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK, "Comment deleted", true, null);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
