package vn.pvhg.backend.dto.request.chat;

import vn.pvhg.backend.enums.ChatType;

import java.util.List;
import java.util.UUID;

public record ChatCreateRequest(
        String groupName,
        String groupImage,
        ChatType chatType,
        List<UUID> memberIds
) {
}