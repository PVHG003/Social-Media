package vn.pvhg.backend.chat.dto.message;

import vn.pvhg.backend.chat.enums.MessageEventType;

public record MessageEvent<T>(
        MessageEventType eventType,
        T data
) {
}
