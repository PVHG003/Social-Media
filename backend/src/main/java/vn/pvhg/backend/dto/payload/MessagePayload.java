package vn.pvhg.backend.dto.payload;

import java.util.List;
import java.util.UUID;

public record MessagePayload(
        String content,
        List<UUID> attachments
) {
}
