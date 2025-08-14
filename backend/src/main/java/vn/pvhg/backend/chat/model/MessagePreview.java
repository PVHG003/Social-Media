package vn.pvhg.backend.chat.model;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class MessagePreview {
    private String content;
    private String senderName;
    private LocalDateTime sentAt;
}
