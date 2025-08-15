package vn.pvhg.backend.chat.dto.payload;

import java.util.List;

public record MessagePayload(
        String content,
        List<String> attachments
) {
}
