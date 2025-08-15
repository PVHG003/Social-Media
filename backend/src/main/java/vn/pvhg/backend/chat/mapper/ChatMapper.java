package vn.pvhg.backend.chat.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.chat.dto.response.ChatDetailDto;
import vn.pvhg.backend.chat.dto.response.ChatListItemDto;
import vn.pvhg.backend.chat.dto.response.ChatParticipantDto;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.ChatParticipant;
import vn.pvhg.backend.chat.model.Message;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatMapper {

    public ChatDetailDto toChatDetailDto(UUID userId, Chat chat, List<ChatParticipant> chatParticipants) {
        String displayChatName = chat.getChatDisplayName(userId);
        String displayChatImageUrl = chat.getChatDisplayImage(userId);
        return new ChatDetailDto(
                chat.getId(),
                chat.getChatType(),
                displayChatName,
                displayChatImageUrl,
                chatParticipants.stream()
                        .map(chatParticipant -> new ChatParticipantDto(
                                chatParticipant.getUser().getId(),
                                chatParticipant.getUser().getUsername(),
                                chatParticipant.getUser().getProfileImage(),
                                chatParticipant.isAdmin()
                        ))
                        .toList()
        );
    }

    public ChatDetailDto toPrivateChatDetailDto(UUID userId, Chat chat, List<ChatParticipant> chatParticipants) {
        String displayName = chat.getChatDisplayName(userId);
        String displayImageUrl = chat.getChatDisplayImage(userId);
        return new ChatDetailDto(
                chat.getId(),
                chat.getChatType(),
                displayName,
                displayImageUrl,
                chatParticipants.stream()
                        .map(chatParticipant -> new ChatParticipantDto(
                                chatParticipant.getUser().getId(),
                                chatParticipant.getUser().getUsername(),
                                chatParticipant.getUser().getProfileImage(),
                                chatParticipant.isAdmin()
                        ))
                        .toList()
        );
    }

    public ChatListItemDto toChatListItemDto(UUID userId, Chat chat, Map<UUID, Message> lastMessageForChats) {
//        MessagePreview lastMessagePreview = chat.getLastMessagePreview();
        Message lastMessage = lastMessageForChats.get(chat.getId());
        String displayName = chat.getChatDisplayName(userId);
        String displayImageUrl = chat.getChatDisplayImage(userId);

        return new ChatListItemDto(
                chat.getId(),
                displayName,
                displayImageUrl,
                lastMessage != null
                        ? (lastMessage.getAttachments().isEmpty()
                        ? lastMessage.getContent()
                        : "Attachment")
                        : null,
                lastMessage != null ? lastMessage.getSentAt() : null,
                lastMessage != null ? lastMessage.getSender().getUsername() : null,
                chat.getUnreadCount(chat.getParticipants().stream()
                        .filter(p -> p.getUser().getId().equals(userId))
                        .findFirst()
                        .map(ChatParticipant::getUser)
                        .orElse(null)),
                chat.getChatType()
        );
//
//        return new ChatListItemDto(
//                chat.getId(),
//                displayChatName,
//                displayChatImageUrl,
//                lastMessagePreview.getContent(),
//                lastMessagePreview.getSentAt(),
//                lastMessagePreview.getSenderName(),
//                chat.getUnreadCount(chat.getParticipants().stream()
//                        .filter(p -> p.getUser().getId().equals(userId))
//                        .findFirst()
//                        .map(ChatParticipant::getUser)
//                        .orElse(null)),
//                chat.getChatType()
//        );

    }
}
