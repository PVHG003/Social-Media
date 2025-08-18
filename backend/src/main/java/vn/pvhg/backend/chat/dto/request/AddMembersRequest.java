package vn.pvhg.backend.chat.dto.request;

import java.util.List;
import java.util.UUID;

public record AddMembersRequest(
        List<UUID> userIds
) {
}
