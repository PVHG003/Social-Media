package vn.pvhg.backend.dto.request.chat;

import java.util.List;
import java.util.UUID;

public record AddMembersRequest(
        List<UUID> userIds
) {
}