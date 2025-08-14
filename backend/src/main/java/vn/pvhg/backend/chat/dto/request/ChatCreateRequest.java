package vn.pvhg.backend.chat.dto.request;

import vn.pvhg.backend.chat.enums.ChatType;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

/**
 * DTO for {@link vn.pvhg.backend.chat.model.Chat}
 */
public record ChatCreateRequest(
        ChatType chatType,
        String groupName,
        String groupImage,
        List<UUID> participantIds
) implements Serializable {
}