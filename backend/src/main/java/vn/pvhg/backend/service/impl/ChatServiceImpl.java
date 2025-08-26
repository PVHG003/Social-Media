package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.pvhg.backend.dto.request.chat.ChatCreateRequest;
import vn.pvhg.backend.dto.request.chat.ChatUpdateRequest;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.dto.response.chat.ChatListResponse;
import vn.pvhg.backend.dto.response.chat.ChatMessageResponse;
import vn.pvhg.backend.enums.ChatType;
import vn.pvhg.backend.enums.MemberRole;
import vn.pvhg.backend.exception.chat.*;
import vn.pvhg.backend.mapper.ChatMapper;
import vn.pvhg.backend.mapper.MessageMapper;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.model.chat.Chat;
import vn.pvhg.backend.model.chat.ChatMember;
import vn.pvhg.backend.model.chat.Message;
import vn.pvhg.backend.repository.ChatMemberRepository;
import vn.pvhg.backend.repository.ChatRepository;
import vn.pvhg.backend.repository.MessageRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.ChatService;

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
    public Page<ChatListResponse> getChatList(UserDetailsImpl userDetails, Pageable pageable) {
        UUID currentUserId = userDetails.getUser().getId();
        Page<Object[]> chatMessageList = chatRepository.getUserChatWithLatestMessage(currentUserId, pageable);
        List<ChatListResponse> chatListResponses = chatMessageList.stream().map(row -> {
            Chat chat = (Chat) row[0];
            Message latestMessage = (Message) row[1];
            return chatMapper.toChatListResponse(currentUserId, chat, latestMessage);
        }).toList();
        return new PageImpl<>(chatListResponses, pageable, chatMessageList.getTotalElements());
    }

    @Override
    public ChatDetailResponse getChatInfo(UserDetailsImpl userDetails, UUID chatId) {
        UUID currentUserId = userDetails.getUser().getId();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat id " + chatId + " not found"));

        if (!chatRepository.existsByMemberIdAndChatId(currentUserId, chatId)) {
            throw new NotChatMemberException("User " + currentUserId + " is not a member of chat " + chatId);
        }

        return chatMapper.toChatDetailResponse(currentUserId, chat, chat.getMembers());
    }

    @Override
    public Page<ChatMessageResponse> getChatMessages(UserDetailsImpl userDetails, UUID chatId, Pageable pageable) {
        UUID currentUserId = userDetails.getUser().getId();

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

        return new PageImpl<>(chatMessageResponses, pageable, messages.getTotalElements());
    }

    @Override
    @Transactional
    public ChatDetailResponse createPrivateChat(UserDetailsImpl userDetails, ChatCreateRequest request) {
        UUID currentUserId = userDetails.getUser().getId();

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

        Chat chat = Chat.builder().chatType(ChatType.PRIVATE).build();
        Chat savedChat = chatRepository.save(chat);

        List<ChatMember> members = List.of(
                ChatMember.builder().chat(savedChat).member(User.builder().id(currentUserId).build()).role(MemberRole.MEMBER).build(),
                ChatMember.builder().chat(savedChat).member(User.builder().id(otherMemberId).build()).role(MemberRole.MEMBER).build()
        );

        List<ChatMember> savedMembers = chatMemberRepository.saveAll(members);

        return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedMembers);
    }

    @Override
    @Transactional
    public ChatDetailResponse createGroupChat(UserDetailsImpl userDetails, ChatCreateRequest request) {
        UUID currentUserId = userDetails.getUser().getId();
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
        membersToSave.add(ChatMember.builder().member(User.builder().id(currentUserId).build()).chat(savedChat).role(MemberRole.ADMIN).build());
        uniqueMemberIds.forEach(memberId -> membersToSave.add(ChatMember.builder().member(User.builder().id(memberId).build()).chat(savedChat).role(MemberRole.MEMBER).build()));

        List<ChatMember> savedMembers = chatMemberRepository.saveAll(membersToSave);

        return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedMembers);
    }

    @Override
    @Transactional
    public ChatDetailResponse addMembers(UserDetailsImpl userDetails, UUID chatId, List<UUID> userIds) {
        UUID currentUserId = userDetails.getUser().getId();

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat id " + chatId + " not found"));

        if (chat.getChatType() != ChatType.GROUP) {
            throw new InvalidChatTypeException("Chat id " + chatId + " is not a group chat");
        }

        boolean isAdmin = chat.getMembers().stream()
                .anyMatch(m -> m.getMember().getId().equals(currentUserId) && m.getRole() == MemberRole.ADMIN);
        if (!isAdmin) {
            throw new NotChatAdminException("Only admins can add members");
        }

        List<UUID> existingMemberIds = chatMemberRepository.findByChatId(chatId).stream()
                .map(chatMember -> chatMember.getMember().getId())
                .toList();

        List<UUID> newMemberIds = userIds.stream()
                .filter(id -> !existingMemberIds.contains(id))
                .distinct()
                .toList();

        List<ChatMember> savedMembers = chatMemberRepository.saveAll(newMemberIds.stream()
                .map(memberId -> ChatMember.builder().member(User.builder().id(memberId).build()).chat(chat).role(MemberRole.MEMBER).build())
                .toList());

        Chat savedChat = chatRepository.save(chat);

        return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedMembers);
    }

    @Override
    public ChatDetailResponse updateChat(UserDetailsImpl userDetails, UUID chatId, ChatUpdateRequest request) {
        // Implementation similar: extract currentUserId and check admin permissions
        return null;
    }

    @Override
    public void deleteChat(UserDetailsImpl userDetails, UUID chatId) {
        // Implementation similar: extract currentUserId and check admin permissions
    }

    @Override
    public ChatDetailResponse removeMember(UserDetailsImpl userDetails, UUID chatId, UUID memberId) {
        // Implementation similar: extract currentUserId and check admin permissions
        return null;
    }
}
