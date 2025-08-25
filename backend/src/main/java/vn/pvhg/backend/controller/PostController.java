package vn.pvhg.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.request.post.PostRequest;
import vn.pvhg.backend.dto.request.post.PostUpdateRequest;
import vn.pvhg.backend.dto.response.PostResponse;
import vn.pvhg.backend.response.ApiPaginatedResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.PostService;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile[] mediaFiles,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            List<MultipartFile> validFiles = mediaFiles != null
                    ? Arrays.stream(mediaFiles).filter(f -> !f.isEmpty()).toList()
                    : List.of();

            PostRequest request = new PostRequest();
            request.setContent(content);
            request.setMediaFiles(validFiles);

            PostResponse data = postService.createPost(userDetails, request);
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.CREATED,
                    "Post created successfully", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error creating post: {}", e.getMessage());
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.BAD_REQUEST,
                    "Failed to create post: " + e.getMessage(), false, null);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            PostResponse data = postService.getPostById(userDetails, postId);
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.OK,
                    "Post retrieved successfully", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error getting post: {}", e.getMessage());
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.NOT_FOUND,
                    "Post not found: " + e.getMessage(), false, null);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        }
    }

    @GetMapping
    public ResponseEntity<ApiPaginatedResponse<List<PostResponse>>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<PostResponse> data = postService.getAllPosts(userDetails, pageable);
            ApiPaginatedResponse<List<PostResponse>> response = new ApiPaginatedResponse<>(
                    HttpStatus.OK,
                    "Posts retrieved successfully",
                    true,
                    data.getContent(),
                    page,
                    size,
                    data.getTotalPages(),
                    data.getTotalElements());
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error getting posts: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiPaginatedResponse<List<PostResponse>>> getPostsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<PostResponse> data = postService.getPostsByUser(userDetails, userId, pageable);
            ApiPaginatedResponse<List<PostResponse>> response = new ApiPaginatedResponse<>(
                    HttpStatus.OK,
                    "User posts retrieved successfully", true, data.getContent(),
                    page,
                    size,
                    data.getTotalPages(),
                    data.getTotalElements());
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error getting user posts: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable UUID postId,
            @RequestBody PostUpdateRequest updateDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            PostResponse data = postService.updatePost(userDetails, postId, updateDto);
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.OK,
                    "Post updated successfully", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error updating post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            postService.deletePost(userDetails, postId);
            ApiResponse<Void> response = new ApiResponse<>(HttpStatus.OK,
                    "Post deleted successfully", true, null);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error deleting post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<PostResponse>> likePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            PostResponse data = postService.likePost(userDetails, postId);
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.OK,
                    "Post liked successfully", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error liking post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<PostResponse>> unlikePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        try {
            PostResponse data = postService.unlikePost(userDetails, postId);
            ApiResponse<PostResponse> response = new ApiResponse<>(HttpStatus.OK,
                    "Post unliked successfully", true, data);
            return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
        } catch (Exception e) {
            log.error("Error unliking post: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}