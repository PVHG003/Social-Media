package vn.pvhg.backend.dto.response.chat;


public record MemberResponse(
        Long id,
        String username,
        String profileImage
) {
}