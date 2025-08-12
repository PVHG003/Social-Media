package vn.pvhg.backend.dto.chat;

import java.util.List;

public record ChatMessage(
        Long chatRoomId,
        Long senderId,
        String content,
        List<String> attachments
) {
}