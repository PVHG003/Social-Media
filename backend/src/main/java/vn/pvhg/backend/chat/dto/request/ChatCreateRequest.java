package vn.pvhg.backend.chat.dto.request;

import vn.pvhg.backend.chat.enums.ChatType;

import java.util.List;
import java.util.UUID;

public record ChatCreateRequest(
        String groupName,
        String groupImage,
        ChatType chatType,
        List<UUID> memberIds
) {
}
