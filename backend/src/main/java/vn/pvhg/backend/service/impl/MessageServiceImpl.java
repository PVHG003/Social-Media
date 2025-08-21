package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.dto.message.OutgoingMessage;
import vn.pvhg.backend.dto.payload.MessagePayload;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.MessageService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    @Override
    public OutgoingMessage saveMessage(UserDetailsImpl userDetails, UUID chatId, MessagePayload messagePayload) {
        return null;
    }

    @Override
    public OutgoingMessage deleteMessage(UserDetailsImpl userDetails, UUID messageId) {
        return null;
    }

    @Override
    public OutgoingMessage updateMessage(UserDetailsImpl userDetails, UUID messageId, MessagePayload messagePayload) {
        return null;
    }
}
