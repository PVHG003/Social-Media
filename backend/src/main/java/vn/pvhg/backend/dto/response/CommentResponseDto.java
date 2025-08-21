package vn.pvhg.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class CommentResponseDto {
    private UUID id;
    private String content;
    private UserDto author;
    private UUID postId;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
    }
}
