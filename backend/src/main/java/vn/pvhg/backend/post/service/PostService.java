package vn.pvhg.backend.post.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.post.dto.request.PostRequestDto;
import vn.pvhg.backend.post.dto.request.PostUpdateDto;
import vn.pvhg.backend.post.dto.response.PostResponseDto;

import java.util.UUID;

public interface PostService {
    PostResponseDto createPost(PostRequestDto requestDto, UUID userId);

    PostResponseDto getPostById(UUID postId, UUID currentUserId);

    Page<PostResponseDto> getAllPosts(Pageable pageable, UUID currentUserId);

    Page<PostResponseDto> getPostsByUserId(UUID userId, Pageable pageable, UUID currentUserId);

    PostResponseDto updatePost(UUID postId, PostUpdateDto updateDto, UUID userId);

    void deletePost(UUID postId, UUID userId);

    PostResponseDto likePost(UUID postId, UUID userId);

    PostResponseDto unlikePost(UUID postId, UUID userId);
}