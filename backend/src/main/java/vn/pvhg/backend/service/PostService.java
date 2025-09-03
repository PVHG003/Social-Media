package vn.pvhg.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.dto.request.post.PostRequest;
import vn.pvhg.backend.dto.request.post.PostUpdateRequest;
import vn.pvhg.backend.dto.response.PostResponse;
import vn.pvhg.backend.security.UserDetailsImpl;

import java.util.UUID;

public interface PostService {
    PostResponse createPost(UserDetailsImpl userDetails, PostRequest request);

    PostResponse getPostById(UserDetailsImpl userDetails, UUID postId);

    Page<PostResponse> getAllPosts(UserDetailsImpl userDetails, Pageable pageable);

    Page<PostResponse> getPostsByUser(UserDetailsImpl userDetails, UUID userId, Pageable pageable);

    PostResponse updatePost(UserDetailsImpl userDetails, UUID postId, PostUpdateRequest updateDto);

    void deletePost(UserDetailsImpl userDetails, UUID postId);

    void deletePostByAdmin(UUID postId);

    PostResponse likePost(UserDetailsImpl userDetails, UUID postId);

    PostResponse unlikePost(UserDetailsImpl userDetails, UUID postId);
}
