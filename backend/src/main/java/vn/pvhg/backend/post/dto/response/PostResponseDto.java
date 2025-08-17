package vn.pvhg.backend.post.dto.response;

import lombok.Data;
import lombok.Builder;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PostResponseDto {
    private UUID id;
    private String content;
    private UserDto author;
    private List<MediaDto> mediaFiles;
    private Integer likeCount;
    private Integer commentCount;
    private boolean isLiked;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    public static class UserDto {
        private UUID id;
        private String username;
        private String email;
    }

    @Data
    @Builder
    public static class MediaDto {
        private Long id;
        private String originalFilename;
        private String publicUrl;
        private String mediaType;
        private Long fileSize;
        private Integer width;
        private Integer height;
        private Integer duration;
        private int position;
    }
}