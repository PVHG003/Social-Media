package vn.pvhg.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.dto.response.chat.ChatListResponse;
import vn.pvhg.backend.dto.response.chat.MemberResponse;
import vn.pvhg.backend.enums.ChatType;
import vn.pvhg.backend.model.chat.Chat;
import vn.pvhg.backend.model.chat.ChatMember;
import vn.pvhg.backend.model.chat.Message;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ChatMapper {
    public ChatListResponse toChatListResponse(Long currentUserId, Chat chat, Message latestMessage) {
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

    public ChatDetailResponse toChatDetailResponse(Long currentUserId, Chat chat, List<ChatMember> chatMembers) {
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
                                chatMember.getMember().getProfileImagePath()
                        ))
                        .collect(Collectors.toList()),
                chat.getCreatedAt()
        );
    }

    /**
     * Private helper to extract the chat display name and image for both private and group chats.
     */
    private ChatDisplayInfo extractChatDisplayInfo(Chat chat, Long currentUserId) {
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
                    .map(member -> member.getMember().getProfileImagePath())
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
                    .map(chatMember -> chatMember.getMember().getProfileImagePath())
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
