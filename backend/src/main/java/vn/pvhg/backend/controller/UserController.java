package vn.pvhg.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.request.UserUpdateRequest;
import vn.pvhg.backend.dto.response.UserResponse;
import vn.pvhg.backend.response.ApiPaginatedResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.service.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse data = userService.getCurrentUser();
        ApiResponse<UserResponse> response = new ApiResponse<>(
                HttpStatus.OK, "", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateCurrentUser(
            @RequestBody UserUpdateRequest request) {
        UserResponse data = userService.updateUser(request);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                HttpStatus.OK, "", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(value = "/me/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadProfileImage(
            @RequestParam(name = "file") MultipartFile file
    ) {
        UserResponse data = userService.uploadProfileImage(file);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                HttpStatus.OK, "", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping(value = "/me/cover-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadCoverImage(
            @RequestParam(name = "file") MultipartFile file
    ) {
        UserResponse data = userService.uploadCoverImage(file);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                HttpStatus.OK, "", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(
            @PathVariable UUID userId) {
        UserResponse data = userService.getUserProfile(userId);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                HttpStatus.OK, "", true, data
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<ApiPaginatedResponse<List<UserResponse>>> getFollowers(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserResponse> data = userService.getFollowers(userId, pageable);
        ApiPaginatedResponse<List<UserResponse>> response = new ApiPaginatedResponse<>(
                HttpStatus.OK, "", true, data.getContent(), page, size, data.getTotalPages(), data.getTotalElements()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<ApiPaginatedResponse<List<UserResponse>>> getFollowing(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserResponse> data = userService.getFollowing(userId, pageable);
        ApiPaginatedResponse<List<UserResponse>> response = new ApiPaginatedResponse<>(
                HttpStatus.OK, "", true, data.getContent(), page, size, data.getTotalPages(), data.getTotalElements()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<Void>> followUser(
            @PathVariable UUID userId
    ) {
        userService.followUser(userId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "Followed", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<Void>> unfollowUser(@PathVariable UUID userId) {
        userService.unfollowUser(userId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK, "Unfollowed", true, null
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiPaginatedResponse<List<UserResponse>>> searchUsers(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserResponse> data = userService.searchUsers(q, pageable);
        ApiPaginatedResponse<List<UserResponse>> response = new ApiPaginatedResponse<>(
                HttpStatus.OK, "", true, data.getContent(), page, size, data.getTotalPages(), data.getTotalElements()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
