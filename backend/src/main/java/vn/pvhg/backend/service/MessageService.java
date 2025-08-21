package vn.pvhg.backend.service;

import vn.pvhg.backend.dto.message.OutgoingMessage;
import vn.pvhg.backend.dto.payload.MessagePayload;
import vn.pvhg.backend.security.UserDetailsImpl;

import java.util.UUID;

public interface MessageService {
    OutgoingMessage saveMessage(UserDetailsImpl userDetails, UUID chatId, MessagePayload messagePayload);

    OutgoingMessage deleteMessage(UserDetailsImpl userDetails, UUID messageId);

    OutgoingMessage updateMessage(UserDetailsImpl userDetails, UUID messageId, MessagePayload messagePayload);
}
