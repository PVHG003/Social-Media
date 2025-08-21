package vn.pvhg.backend.dto.request.chat;

import vn.pvhg.backend.enums.ChatType;

import java.util.List;

public record ChatCreateRequest(
        String groupName,
        String groupImage,
        ChatType chatType,
        List<Long> memberIds
) {
}