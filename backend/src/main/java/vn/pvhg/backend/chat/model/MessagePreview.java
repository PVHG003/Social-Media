package vn.pvhg.backend.chat.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
public class MessagePreview {
    private String content;
    private String senderName;
    private LocalDateTime sentAt;
}
