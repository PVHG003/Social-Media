package vn.pvhg.backend.dto.response.chat;


import java.util.UUID;

public record MemberResponse(
        UUID id,
        String username,
        String profileImage
) {
}