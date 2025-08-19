package vn.pvhg.backend.chat.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.model.User;
import vn.pvhg.backend.chat.dto.request.ChatCreateRequest;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;
import vn.pvhg.backend.chat.dto.response.ChatListResponse;
import vn.pvhg.backend.chat.dto.response.ChatMessageResponse;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.enums.MemberRole;
import vn.pvhg.backend.chat.exception.*;
import vn.pvhg.backend.chat.mapper.ChatMapper;
import vn.pvhg.backend.chat.mapper.MessageMapper;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.ChatMember;
import vn.pvhg.backend.chat.model.Message;
import vn.pvhg.backend.chat.repository.ChatMemberRepository;
import vn.pvhg.backend.chat.repository.ChatRepository;
import vn.pvhg.backend.chat.repository.MessageRepository;
import vn.pvhg.backend.chat.service.ChatService;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final ChatMemberRepository chatMemberRepository;

    @Override
    public Page<ChatListResponse> getChatList(UUID currentUserId, Pageable pageable) {
        Page<Object[]> chatMessageList = chatRepository.getUserChatWithLatestMessage(currentUserId, pageable);
        List<ChatListResponse> chatListResponses = chatMessageList.stream().map(row -> {
            Chat chat = (Chat) row[0];
            Message latestMessage = (Message) row[1]; // could be null if no messages

            return chatMapper.toChatListResponse(currentUserId, chat, latestMessage);
        }).toList();

        return new PageImpl<>(chatListResponses, pageable, chatMessageList.getTotalElements());
    }

    @Override
    public ChatDetailResponse getChatInfo(UUID currentUserId, UUID chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat id " + chatId + " not found"));

        if (!chatRepository.existsByMemberIdAndChatId(currentUserId, chatId)) {
            throw new NotChatMemberException("User " + currentUserId + " is not a member of chat " + chatId);
        }

        return chatMapper.toChatDetailResponse(currentUserId, chat, chat.getMembers());
    }

    @Override
    public Page<ChatMessageResponse> getChatMessages(UUID currentUserId, UUID chatId, Pageable pageable) {
        if (!chatRepository.existsById(chatId)) {
            throw new ChatNotFoundException("Chat id " + chatId + " not found");
        }

        if (!chatRepository.existsByMemberIdAndChatId(currentUserId, chatId)) {
            throw new NotChatMemberException("User " + currentUserId + " is not a member of chat " + chatId);
        }

        Page<Message> messages = messageRepository.findByChatId(chatId, pageable);

        List<ChatMessageResponse> chatMessageResponses = messages.stream()
                .map(message -> messageMapper.toChatMessageResponse(currentUserId, message))
                .toList();

        return new PageImpl<>(
                chatMessageResponses, pageable, messages.getTotalElements()
        );
    }

    @Override
    public ChatDetailResponse createPrivateChat(UUID currentUserId, ChatCreateRequest request) {
        if (request.memberIds() == null || request.memberIds().isEmpty()) {
            throw new ChatCreationException("Member ids cannot be null or empty");
        }
        if (request.memberIds().size() != 1) {
            throw new ChatCreationException("Private chat can only have 1 other member excluding the current user");
        }
        if (request.memberIds().contains(currentUserId)) {
            throw new ChatCreationException("Current user cannot be included in the list");
        }

        UUID otherMemberId = request.memberIds().getFirst();
        if (chatRepository.existsBetweenMembers(currentUserId, otherMemberId)) {
            throw new ChatCreationException("Chat already exists between the members");
        }

        Chat chat = Chat.builder()
                .chatType(ChatType.PRIVATE)
                .build();
        Chat savedChat = chatRepository.save(chat);

        List<ChatMember> members = new ArrayList<>();
        members.add(ChatMember.builder()
                .chat(savedChat)
                .member(User.builder().id(currentUserId).build())
                .role(MemberRole.MEMBER)
                .build());
        members.add(ChatMember.builder()
                .chat(savedChat)
                .member(User.builder().id(otherMemberId).build())
                .role(MemberRole.MEMBER)
                .build());

        List<ChatMember> savedMembers = chatMemberRepository.saveAll(members);

        return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedMembers);
    }

    @Override
    public ChatDetailResponse createGroupChat(UUID currentUserId, ChatCreateRequest request) {
        Set<UUID> uniqueMemberIds = new HashSet<>(request.memberIds());

        if (uniqueMemberIds.contains(currentUserId)) {
            throw new ChatCreationException("Current user cannot be included in the list");
        }

        Chat chat = Chat.builder()
                .chatType(ChatType.GROUP)
                .groupName(request.groupName())
                .groupImage(request.groupImage())
                .build();
        Chat savedChat = chatRepository.save(chat);

        List<ChatMember> membersToSave = new ArrayList<>();
        membersToSave.add(ChatMember.builder()
                .member(User.builder().id(currentUserId).build())
                .chat(savedChat)
                .role(MemberRole.ADMIN)
                .build());
        membersToSave.addAll(uniqueMemberIds.stream()
                .map(memberId -> ChatMember.builder()
                        .member(User.builder().id(memberId).build())
                        .chat(savedChat)
                        .role(MemberRole.MEMBER)
                        .build())
                .toList());

        List<ChatMember> savedMembers = chatMemberRepository.saveAll(membersToSave);

        return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedMembers);
    }

    @Override
    public ChatDetailResponse addMembers(UUID currentUserId, UUID chatId, List<UUID> userIds) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat id " + chatId + " not found"));

        if (chat.getChatType() != ChatType.GROUP) {
            throw new InvalidChatTypeException("Chat id " + chatId + " is not a group chat");
        }

        boolean isAdmin = chat.getMembers().stream()
                .anyMatch(m -> m.getMember().getId().equals(currentUserId) && m.getRole() == MemberRole.ADMIN);
        if (!isAdmin) {
            throw new NotChatAdminException("Only admins can update the group image");
        }

        List<UUID> existingMemberIds = chatMemberRepository.findByChatId(chatId)
                .stream()
                .map(chatMember -> chatMember.getMember().getId())
                .toList();

        List<UUID> newMemberIds = userIds.stream()
                .filter(id -> !existingMemberIds.contains(id))
                .distinct()
                .toList();

        List<ChatMember> savedMembers = chatMemberRepository.saveAll(newMemberIds.stream()
                .map(memberId -> ChatMember.builder()
                        .member(User.builder().id(memberId).build())
                        .chat(chat)
                        .role(MemberRole.MEMBER)
                        .build())
                .toList());

        Chat savedChat = chatRepository.save(chat);

        return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedMembers);
    }
}
