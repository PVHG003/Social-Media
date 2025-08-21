package vn.pvhg.backend.dto.request.chat;

import java.util.List;

public record AddMembersRequest(
        List<Long> userIds
) {
}