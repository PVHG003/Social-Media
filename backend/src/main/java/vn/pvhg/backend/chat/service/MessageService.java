package vn.pvhg.backend.chat.service;

import vn.pvhg.backend.chat.dto.message.OutgoingMessage;
import vn.pvhg.backend.chat.dto.payload.MessagePayload;

import java.util.UUID;

public interface MessageService {
    OutgoingMessage saveMessage(UUID currentUserId, UUID chatId, MessagePayload messagePayload);
}
