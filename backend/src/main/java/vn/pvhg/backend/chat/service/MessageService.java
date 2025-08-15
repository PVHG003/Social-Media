package vn.pvhg.backend.chat.service;

import vn.pvhg.backend.chat.dto.payload.MessagePayload;
import vn.pvhg.backend.chat.dto.response.MessageDto;

import java.util.UUID;

public interface MessageService {
    MessageDto saveMessage(UUID currentUserId, UUID chatId, MessagePayload messagePayload);

    void deleteMessage(UUID currentUserId, UUID chatId, UUID messageId);
}
