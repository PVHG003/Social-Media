package vn.pvhg.backend.chat.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.chat.dto.request.ChatCreateRequest;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;
import vn.pvhg.backend.chat.dto.response.ChatListResponse;
import vn.pvhg.backend.chat.dto.response.ChatMessageResponse;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    Page<ChatListResponse> getChatList(UUID currentUserId, Pageable pageable);

    ChatDetailResponse getChatInfo(UUID currentUserId, UUID chatId);

    Page<ChatMessageResponse> getChatMessages(UUID currentUserId, UUID chatId, Pageable pageable);

    ChatDetailResponse createPrivateChat(UUID currentUserId, ChatCreateRequest request);

    ChatDetailResponse createGroupChat(UUID currentUserId, ChatCreateRequest request);

    ChatDetailResponse addMembers(UUID currentUserId, UUID chatId, List<UUID> userIds);
}
