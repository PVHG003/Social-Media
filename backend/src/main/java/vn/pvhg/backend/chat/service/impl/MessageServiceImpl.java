package vn.pvhg.backend.chat.service.impl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.model.User;
import vn.pvhg.backend.chat.dto.payload.MessagePayload;
import vn.pvhg.backend.chat.dto.response.MessageDto;
import vn.pvhg.backend.chat.enums.AttachmentStatus;
import vn.pvhg.backend.chat.enums.MessageState;
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
    private final MessageMapper messageMapper;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    @Override
    public MessageDto saveMessage(UUID currentUserId, UUID chatId, MessagePayload messagePayload) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat not found"));

        if (messagePayload.content() == null || messagePayload.content().isBlank()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        Message message = Message.builder()
                .content(messagePayload.content())
                .state(MessageState.SENT)
                .sender(User.builder().id(currentUserId).build())
                .chat(chat)
                .build();
        Message savedMessage = messageRepository.save(message);

        if (messagePayload.attachments() != null && !messagePayload.attachments().isEmpty()) {
            List<Attachment> attachments = attachmentRepository.findAllAttachments(messagePayload.attachments());
            attachments.forEach(a -> {
                a.setStatus(AttachmentStatus.PERMANENT);
                a.setMessage(savedMessage);
            });
            attachmentRepository.saveAll(attachments);
        }

        return messageMapper.toMessageDto(currentUserId, savedMessage);
    }

    @Override
    public void deleteMessage(UUID currentUserId, UUID chatId, UUID messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (!message.getSender().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not allowed to delete this message");
        }

        message.setDeleted(true);
        message.setDeletedAt(LocalDateTime.now());

        messageRepository.save(message);
    }
}
