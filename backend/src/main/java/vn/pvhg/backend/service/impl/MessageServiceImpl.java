package vn.pvhg.backend.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.dto.chat.ChatMessage;
import vn.pvhg.backend.model.chat.ChatRoom;
import vn.pvhg.backend.model.chat.Message;
import vn.pvhg.backend.model.media.Attachment;
import vn.pvhg.backend.repository.ChatRoomRepository;
import vn.pvhg.backend.service.MessageService;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final ChatRoomRepository chatRoomRepository;

    @Override
    public List<ChatMessage> getMessages(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found with id: " + roomId));
        Set<Message> messages = chatRoom.getMessages();
        return messages.stream()
                .map(message -> new ChatMessage(
                        roomId,
                        message.getSender().getId(),
                        message.getContent(),
                        message.getAttachments().stream()
                                .map(Attachment::getUrl)
                                .toList()))
                .toList();
    }
}
