package vn.pvhg.backend.post.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.post.dto.request.PostRequestDto;
import vn.pvhg.backend.post.dto.request.PostUpdateDto;
import vn.pvhg.backend.post.dto.response.PostResponseDto;
import vn.pvhg.backend.post.service.PostService;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PostResponseDto> createPost(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile[] mediaFiles,
            @RequestHeader("Authorization") String token) {

        try {
            UUID userId = extractUserIdFromToken(token);

            PostRequestDto requestDto = new PostRequestDto();
            requestDto.setContent(content);

            if (mediaFiles != null && mediaFiles.length > 0) {
                List<MultipartFile> validFiles = Arrays.stream(mediaFiles)
                        .filter(file -> !file.isEmpty())
                        .toList();
                requestDto.setMediaFiles(validFiles);
            }

            PostResponseDto response = postService.createPost(requestDto, userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error creating post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPost(
            @PathVariable UUID postId,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            UUID currentUserId = token != null ? extractUserIdFromToken(token) : null;
            PostResponseDto response = postService.getPostById(postId, currentUserId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting post: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            UUID currentUserId = token != null ? extractUserIdFromToken(token) : null;
            Pageable pageable = PageRequest.of(page, size);
            Page<PostResponseDto> response = postService.getAllPosts(pageable, currentUserId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting posts: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostResponseDto>> getPostsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            UUID currentUserId = token != null ? extractUserIdFromToken(token) : null;
            Pageable pageable = PageRequest.of(page, size);
            Page<PostResponseDto> response = postService.getPostsByUserId(userId, pageable, currentUserId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting user posts: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDto> updatePost(
            @PathVariable UUID postId,
            @RequestBody PostUpdateDto updateDto,
            @RequestHeader("Authorization") String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            PostResponseDto response = postService.updatePost(postId, updateDto, userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error updating post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable UUID postId,
            @RequestHeader("Authorization") String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            postService.deletePost(postId, userId);
            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Error deleting post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponseDto> likePost(
            @PathVariable UUID postId,
            @RequestHeader("Authorization") String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            PostResponseDto response = postService.likePost(postId, userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error liking post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<PostResponseDto> unlikePost(
            @PathVariable UUID postId,
            @RequestHeader("Authorization") String token) {

        try {
            UUID userId = extractUserIdFromToken(token);
            PostResponseDto response = postService.unlikePost(postId, userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error unliking post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    private UUID extractUserIdFromToken(String token) {
        // TODO: Implement JWT token parsing
        // Temporary return for testing
        return UUID.fromString("123e4567-e89b-12d3-a456-426614174000");
    }
}