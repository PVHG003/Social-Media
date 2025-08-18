package vn.pvhg.backend.chat.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.model.User;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final AttachmentRepository attachmentRepository;
    private final MessageMapper messageMapper;

    @Override
    public OutgoingMessage saveMessage(UUID currentUserId, UUID chatId, MessagePayload messagePayload) {
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

        return messageMapper.toOutgoingMessage(currentUserId, savedMessage);
    }
}
