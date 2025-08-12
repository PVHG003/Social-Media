package vn.pvhg.backend.service;

import vn.pvhg.backend.dto.chat.ChatMessage;

import java.util.List;

public interface MessageService {

    List<ChatMessage> getMessages(Long roomId);
}
