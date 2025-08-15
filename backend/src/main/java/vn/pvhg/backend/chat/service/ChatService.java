package vn.pvhg.backend.chat.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.chat.dto.request.ChatCreateRequest;
import vn.pvhg.backend.chat.dto.response.ChatDetailDto;
import vn.pvhg.backend.chat.dto.response.ChatListItemDto;
import vn.pvhg.backend.chat.dto.response.MessageDto;

import java.util.UUID;

public interface ChatService {
    Page<ChatListItemDto> getUserChats(UUID id, Pageable pageable);

    ChatDetailDto getChatDetail(UUID userId, UUID chatId);

    Page<MessageDto> getChatMessages(UUID userId, UUID chatId, Pageable pageable);

    ChatDetailDto createPrivateChat(UUID currentUserId, ChatCreateRequest request, MultipartFile coverImage);

    ChatDetailDto createGroupChat(UUID currentUserId, ChatCreateRequest request, MultipartFile coverImage);

    void deleteChat(UUID currentUserId, UUID chatId);

    void addMemberToChat(UUID currentUserId, UUID chatId, UUID memberToAddUserId);

    void leaveChat(UUID currentUserId, UUID chatId);
}
