package vn.pvhg.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.dto.request.chat.ChatCreateRequest;
import vn.pvhg.backend.dto.request.chat.ChatUpdateRequest;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.dto.response.chat.ChatListResponse;
import vn.pvhg.backend.dto.response.chat.ChatMessageResponse;
import vn.pvhg.backend.security.UserDetailsImpl;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    Page<ChatListResponse> getChatList(UserDetailsImpl userDetails, Pageable pageable);

    ChatDetailResponse getChatInfo(UserDetailsImpl userDetails, UUID chatId);

    Page<ChatMessageResponse> getChatMessages(UserDetailsImpl userDetails, UUID chatId, Pageable pageable);

    ChatDetailResponse createPrivateChat(UserDetailsImpl userDetails, ChatCreateRequest request);

    ChatDetailResponse createGroupChat(UserDetailsImpl userDetails, ChatCreateRequest request);

    ChatDetailResponse addMembers(UserDetailsImpl userDetails, UUID chatId, List<UUID> uuids);

    ChatDetailResponse updateChat(UserDetailsImpl userDetails, UUID chatId, ChatUpdateRequest request);

    void deleteChat(UserDetailsImpl userDetails, UUID chatId);

    ChatDetailResponse removeMember(UserDetailsImpl userDetails, UUID chatId, UUID memberId);
}
