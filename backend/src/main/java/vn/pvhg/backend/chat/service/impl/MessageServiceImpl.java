package vn.pvhg.backend.chat.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.hung.model.User;
import vn.pvhg.backend.auth.hung.repository.UserRepository;
import vn.pvhg.backend.chat.dto.message.OutgoingMessage;
import vn.pvhg.backend.chat.dto.payload.MessagePayload;
import vn.pvhg.backend.chat.enums.FileState;
import vn.pvhg.backend.chat.exception.ChatNotFoundException;
import vn.pvhg.backend.chat.mapper.MessageMapper;
import vn.pvhg.backend.chat.model.Attachment;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.model.Message;
import vn.pvhg.backend.chat.repository.AttachmentRepository;
import vn.pvhg.backend.chat.repository.ChatRepository;
import vn.pvhg.backend.chat.repository.MessageRepository;
import vn.pvhg.backend.chat.service.MessageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final AttachmentRepository attachmentRepository;
    private final MessageMapper messageMapper;
    private final UserRepository userRepository;

    @Override
    public OutgoingMessage saveMessage(UUID currentUserId, UUID chatId, MessagePayload messagePayload) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User id " + currentUserId + " not found"));

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
            List<Attachment> attachments = attachmentRepository.findAllByIdInAndUploader(messagePayload.attachments(), currentUserId);
            attachments.forEach(attachment -> {
                attachment.setMessage(savedMessage);
                attachment.setFileState(FileState.PERMANENT);
                attachment.setUploader(User.builder().id(currentUserId).build());
            });
            attachmentRepository.saveAll(attachments);
        }

        return messageMapper.toOutgoingMessage(user, savedMessage);
    }

    @Override
    public OutgoingMessage deleteMessage(UUID currentUserId, UUID messageId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User id " + currentUserId + " not found"));

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
    public OutgoingMessage updateMessage(UUID currentUserId, UUID messageId, MessagePayload messagePayload) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new EntityNotFoundException("User id " + currentUserId + " not found"));

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ChatNotFoundException("Message id " + messageId + " not found"));

        if (!message.getSender().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to update this message");
        }

        if (message.isDeleted()) {
            throw new AccessDeniedException("Message is deleted");
        }

        message.setContent(messagePayload.content());
        messageRepository.save(message);

        return messageMapper.toOutgoingMessage(user, message);
    }
}
