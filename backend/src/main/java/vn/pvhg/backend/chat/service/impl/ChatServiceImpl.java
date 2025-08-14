package vn.pvhg.backend.chat.service.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.model.User;
import vn.pvhg.backend.chat.dto.request.ChatCreateRequest;
import vn.pvhg.backend.chat.dto.response.ChatDetailDto;
import vn.pvhg.backend.chat.dto.response.ChatListItemDto;
import vn.pvhg.backend.chat.dto.response.MessageDto;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.mapper.ChatMapper;
import vn.pvhg.backend.chat.mapper.MessageMapper;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.ChatParticipant;
import vn.pvhg.backend.chat.model.Message;
import vn.pvhg.backend.chat.repository.ChatParticipantRepository;
import vn.pvhg.backend.chat.repository.ChatRepository;
import vn.pvhg.backend.chat.repository.MessageRepository;
import vn.pvhg.backend.chat.service.ChatService;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final ChatMapper chatMapper;
    private final MessageMapper messageMapper;

    @Override
    public Page<ChatListItemDto> getUserChats(UUID userId, Pageable pageable) {
        Page<Chat> chatPage = chatRepository.findAllByUserId(userId, pageable);
        log.info("Found {} chats for user {}", chatPage.getTotalElements(), userId);

        List<UUID> chatIds = chatPage.getContent().stream().map(Chat::getId).toList();
        log.info("Found {} chat ids for user {}", chatIds.size(), userId);

        Map<UUID, Message> lastMessageForChats = messageRepository.findLastMessagesForChats(chatIds)
                .stream()
                .collect(Collectors.toMap(
                        m -> m.getChat().getId(),
                        m -> m,
                        (m1, m2) ->
                                m2.getSentAt().isAfter(m1.getSentAt()) ? m2 : m1
                ));
        lastMessageForChats.forEach((k, v) -> log.info("Found last message for chat {}", k));

        List<ChatListItemDto> dtos = chatPage.getContent().stream()
                .map(chat -> chatMapper.toChatListItemDto(userId, chat, lastMessageForChats))
                .toList();
        log.info("Mapped {} chat list items for user {}", dtos.size(), userId);

        return new PageImpl<>(dtos, pageable, chatPage.getTotalElements());
    }

    @Override
    public ChatDetailDto getChatDetail(UUID userId, UUID chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        List<ChatParticipant> chatParticipants = chatParticipantRepository.getParticipantsByChat(chat);
        List<UUID> participantIds = chatParticipants.stream().map(ChatParticipant::getUser).map(User::getId).toList();

        if (!participantIds.contains(userId)) {
            throw new AccessDeniedException("Access to chat " + chatId + " is denied, not a member");
        }

        return chatMapper.toChatDetailDto(userId, chat, chatParticipants);
    }

    @Override
    public Page<MessageDto> getChatMessages(UUID userId, UUID chatId, Pageable pageable) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        List<ChatParticipant> chatParticipants = chatParticipantRepository.getParticipantsByChat(chat);
        List<UUID> participantIds = chatParticipants.stream().map(ChatParticipant::getUser).map(User::getId).toList();

        if (!participantIds.contains(userId)) {
            throw new AccessDeniedException("Access to chat " + chatId + " is denied, not a member");
        }

        Page<Message> messages = messageRepository.getAllByChatId(chatId, pageable);

        List<MessageDto> dtos = messages.getContent().stream()
                .map(message -> messageMapper.toMessageDto(userId, message))
                .toList();

        return new PageImpl<>(dtos, pageable, messages.getTotalElements());
    }

    @Transactional
    @Override
    public ChatDetailDto createPrivateChat(UUID currentUserId, ChatCreateRequest request) {
        if (request.participantIds().size() != 1) {
            throw new IllegalArgumentException("Private chat must have exactly 2 participants including the current user");
        }

        UUID otherUserId = request.participantIds().getFirst();
        if (otherUserId.equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot create a private chat with yourself");
        }

        if (chatRepository.existsPrivateChatBetween(currentUserId, otherUserId)) {
            throw new IllegalStateException("Private chat already exists");
        }

        Chat chat = Chat.builder()
                .groupName(request.groupName())
                .groupImage(request.groupImage())
                .chatType(ChatType.PRIVATE)
                .build();
        Chat savedChat = chatRepository.save(chat);

        List<ChatParticipant> participants = List.of(
                ChatParticipant.builder()
                        .chat(savedChat)
                        .user(User.builder().id(currentUserId).build())
                        .isAdmin(true)
                        .build(),
                ChatParticipant.builder()
                        .chat(savedChat)
                        .user(User.builder().id(otherUserId).build())
                        .isAdmin(false)
                        .build()
        );
        List<ChatParticipant> savedChatParticipants = chatParticipantRepository.saveAll(participants);

        return chatMapper.toChatDetailDto(currentUserId, savedChat, savedChatParticipants);
    }

    @Transactional
    @Override
    public ChatDetailDto createGroupChat(UUID currentUserId, ChatCreateRequest request) {
        Set<UUID> participantIds = request.participantIds().stream()
                .filter(id -> !id.equals(currentUserId))
                .collect(Collectors.toSet());
        if (participantIds.isEmpty()) {
            throw new IllegalArgumentException("Group chat must have at least one other participant besides the current user");
        }

        Chat chat = Chat.builder()
                .chatType(ChatType.GROUP)
                .groupName(request.groupName())
                .groupImage(request.groupImage())
                .build();
        Chat savedChat = chatRepository.save(chat);

        List<ChatParticipant> savedChatParticipants = chatParticipantRepository.saveAll(participantIds.stream()
                .filter(cp -> !cp.equals(currentUserId))
                .map(id -> ChatParticipant.builder()
                        .chat(savedChat)
                        .user(User.builder().id(id).build())
                        .isAdmin(false)
                        .build())
                .toList());
        savedChatParticipants.add(chatParticipantRepository.save(ChatParticipant.builder()
                .chat(savedChat)
                .user(User.builder().id(currentUserId).build())
                .isAdmin(true)
                .build()));

        return chatMapper.toChatDetailDto(currentUserId, chat, savedChatParticipants);
    }

    @Transactional
    @Override
    public void deleteChat(UUID currentUserId, UUID chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        boolean isAdmin = chatParticipantRepository.getParticipantsByChat(chat).stream()
                .anyMatch(p -> p.getUser().getId().equals(currentUserId) && p.isAdmin());
        if (!isAdmin) {
            throw new AccessDeniedException("Access to chat " + chatId + " is denied, not an admin");
        }

        chatRepository.delete(chat);
    }

    @Transactional
    @Override
    public void addMemberToChat(UUID currentUserId, UUID chatId, UUID memberToAddUserId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));


        if (!chatParticipantRepository.existsByChatAndUserIdAndIsAdminTrue(chat, currentUserId)) {
            throw new AccessDeniedException("Access to chat " + chatId + " is denied, not an admin");
        }
        if (chat.isPrivate()) {
            throw new IllegalStateException("Private chat cannot be modified");
        }
        if (chatParticipantRepository.existsByChatIdAndUserId(chatId, memberToAddUserId)) {
            throw new IllegalStateException("User is already in the chat");
        }
        ChatParticipant chatParticipant = ChatParticipant.builder()
                .chat(chat)
                .user(User.builder().id(memberToAddUserId).build())
                .isAdmin(false)
                .build();
        chatParticipantRepository.save(chatParticipant);
    }

    @Transactional
    @Override
    public void leaveChat(UUID currentUserId, UUID chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        if (chatParticipantRepository.existsByChatAndUserIdAndIsAdminTrue(chat, currentUserId)) {
            long adminCount = chatParticipantRepository.countByChatIdAndIsAdminTrue(chatId);
            if (adminCount <= 1) {
                throw new AccessDeniedException("The last admin cannot leave the chat");
            }
        }

        int deleted = chatParticipantRepository.deleteChatParticipantByChatIdAndUserId(chatId, currentUserId);
        if (deleted == 0) {
            throw new EntityNotFoundException("User is not a participant in chat " + chatId);
        }
    }
}
