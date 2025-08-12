package vn.pvhg.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.dto.chat.ChatMessage;
import vn.pvhg.backend.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final MessageService messageService;

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(messageService.getMessages(roomId));
    }

    @PostMapping("/rooms")
    public ResponseEntity<Void> createChatRoom() {

    }
}
