package vn.pvhg.backend.chat.dto.request;

import vn.pvhg.backend.chat.enums.MessageType;

public record SendMessageRequest(
        String content,
        MessageType type // TEXT, IMAGE, FILE, etc.
) {
}
