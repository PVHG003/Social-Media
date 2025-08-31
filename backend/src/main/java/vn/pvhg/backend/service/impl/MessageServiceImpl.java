package vn.pvhg.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import vn.pvhg.backend.dto.message.OutgoingMessage;
import vn.pvhg.backend.dto.payload.MessagePayload;
import vn.pvhg.backend.enums.FileState;
import vn.pvhg.backend.exception.chat.ChatNotFoundException;
import vn.pvhg.backend.exception.share.ResourceNotFoundException;
import vn.pvhg.backend.mapper.MessageMapper;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.model.chat.Chat;
import vn.pvhg.backend.model.chat.ChatAttachment;
import vn.pvhg.backend.model.chat.Message;
import vn.pvhg.backend.repository.AttachmentRepository;
import vn.pvhg.backend.repository.ChatRepository;
import vn.pvhg.backend.repository.MessageRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.MessageService;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final AttachmentRepository attachmentRepository;
    private final MessageMapper messageMapper;

    @Override
    @Transactional
    public OutgoingMessage saveMessage(UserDetailsImpl userDetails, UUID chatId, MessagePayload messagePayload) {
        User user = userDetails.getUser();
        UUID currentUserId = user.getId();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat id " + chatId + " not found"));

        if (!chatRepository.existsByMemberIdAndChatId(currentUserId, chatId)) {
            throw new ChatNotFoundException("User " + currentUserId + " is not a member of chat " + chatId);
        }

        Message message = Message.builder()
                .content(messagePayload.content())
                .sender(User.builder().id(currentUserId).build())
                .chat(chat)
                .build();
        Message savedMessage = messageRepository.save(message);

        if (messagePayload.attachments() != null && !messagePayload.attachments().isEmpty()) {
            List<ChatAttachment> attachments = attachmentRepository.findAllByIdInAndUploader(messagePayload.attachments(), currentUserId);
            attachments.forEach(attachment -> {
                attachment.setMessage(savedMessage);
                attachment.setFileState(FileState.PERMANENT);
                attachment.setUploader(User.builder().id(currentUserId).build());
            });
            attachmentRepository.saveAll(attachments);
        }
        Message reloadedMessage = messageRepository.findByIdWithAttachments(savedMessage.getId())
                .orElseThrow(() -> new ChatNotFoundException("Message not found after save"));

        return messageMapper.toOutgoingMessage(user, reloadedMessage);
    }

    @Override
    @Transactional
    public OutgoingMessage deleteMessage(UserDetailsImpl userDetails, UUID messageId) {
        User user = userDetails.getUser();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ChatNotFoundException("Message id " + messageId + " not found"));

        if (!message.getSender().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this message");
        }

        message.setDeleted(true);
        message.setDeletedAt(LocalDateTime.now());
        messageRepository.save(message);

        return messageMapper.toOutgoingMessage(user, message);
    }

    @Override
    @Transactional
    public OutgoingMessage updateMessage(UserDetailsImpl userDetails, UUID messageId, MessagePayload messagePayload) {
        User user = userDetails.getUser();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ChatNotFoundException("Message id " + messageId + " not found"));

        if (!message.getSender().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to update this message");
        }

        if (message.isDeleted()) {
            throw new ResourceNotFoundException("Message not found");
        }

        message.setContent(messagePayload.content());
        messageRepository.save(message);

        return messageMapper.toOutgoingMessage(user, message);
    }
}
