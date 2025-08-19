package vn.pvhg.backend.chat.mapper;

import org.springframework.stereotype.Service;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;
import vn.pvhg.backend.chat.dto.response.ChatListResponse;
import vn.pvhg.backend.chat.dto.response.MemberResponse;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.ChatMember;
import vn.pvhg.backend.chat.model.Message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatMapper {

    public ChatListResponse toChatListResponse(UUID currentUserId, Chat chat, Message latestMessage) {
        // Extract latest message info
        ChatLatestMessageInfo latestMessageInfo = Optional.ofNullable(extractLatestMessageInfo(latestMessage))
                .orElse(new ChatLatestMessageInfo(null, null, null));
        // Extract display name and image
        ChatDisplayInfo displayInfo = Optional.of(extractChatDisplayInfo(chat, currentUserId))
                .orElse(new ChatDisplayInfo(null, null));

        // Unread messages count
        int unreadMessagesCount = chat.getMembers().stream()
                .filter(member -> !member.getMember().getId().equals(currentUserId))
                .mapToInt(ChatMember::getUnreadCount)
                .sum();

        return new ChatListResponse(
                chat.getId(),
                displayInfo.name(),
                displayInfo.image(),
                chat.getChatType(),
                latestMessageInfo.content(),
                latestMessageInfo.senderUsername(),
                latestMessageInfo.sentAt(),
                unreadMessagesCount,
                chat.getMembers().stream()
                        .filter(member -> member.getMember().getId().equals(currentUserId))
                        .findFirst()
                        .map(ChatMember::isMuted)
                        .orElse(false),
                chat.getCreatedAt()
        );
    }

    public ChatDetailResponse toChatDetailResponse(UUID currentUserId, Chat chat, List<ChatMember> chatMembers) {
        ChatDisplayInfo displayInfo = extractChatDisplayInfo(chat, currentUserId);

        return new ChatDetailResponse(
                chat.getId(),
                displayInfo.name(),
                displayInfo.image(),
                chat.getChatType(),
                chatMembers.stream()
                        .map(chatMember -> new MemberResponse(
                                chatMember.getMember().getId(),
                                chatMember.getMember().getUsername(),
                                chatMember.getMember().getProfileImage()
                        ))
                        .collect(Collectors.toList()),
                chat.getCreatedAt()
        );
    }

    /**
     * Private helper to extract the chat display name and image for both private and group chats.
     */
    private ChatDisplayInfo extractChatDisplayInfo(Chat chat, UUID currentUserId) {
        String name;
        String image;

        if (chat.getChatType() == ChatType.PRIVATE) {
            name = chat.getMembers().stream()
                    .filter(member -> !member.getMember().getId().equals(currentUserId))
                    .map(member -> member.getMember().getUsername())
                    .findFirst()
                    .orElse(null);

            image = chat.getMembers().stream()
                    .filter(chatMember -> chatMember != null && chatMember.getMember() != null) // null-safety
                    .filter(chatMember -> !chatMember.getMember().getId().equals(currentUserId))
                    .map(member -> member.getMember().getProfileImage())
                    .filter(img -> img != null && !img.isBlank()) // ignore null or empty images
                    .findFirst()
                    .orElse(null);

        } else { // GROUP
            name = chat.getGroupName() != null && !chat.getGroupName().isBlank()
                    ? chat.getGroupName()
                    : chat.getMembers().stream()
                    .map(chatMember -> chatMember.getMember().getUsername())
                    .collect(Collectors.joining(", "));

            image = chat.getGroupImage() != null && !chat.getGroupImage().isBlank()
                    ? chat.getGroupImage()
                    : chat.getMembers().stream()
                    .map(chatMember -> chatMember.getMember().getProfileImage())
                    .filter(img -> img != null && !img.isBlank())
                    .findFirst()
                    .orElse(null);
        }

        return new ChatDisplayInfo(name, image);
    }

    private ChatLatestMessageInfo extractLatestMessageInfo(Message latestMessage) {
        if (latestMessage == null) {
            return null;
        }

        String latestMessageContent = latestMessage.getContent();
        String latestMessageSenderUsername = latestMessage.getSender().getUsername();
        LocalDateTime latestMessageSentAt = latestMessage.getSentAt();

        return new ChatLatestMessageInfo(
                latestMessageContent,
                latestMessageSenderUsername,
                latestMessageSentAt);
    }

    private record ChatDisplayInfo(String name, String image) {
    }

    private record ChatLatestMessageInfo(String content, String senderUsername, LocalDateTime sentAt) {
    }
}
