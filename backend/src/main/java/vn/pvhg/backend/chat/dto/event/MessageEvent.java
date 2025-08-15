package vn.pvhg.backend.chat.dto.event;

import vn.pvhg.backend.chat.enums.MessageEventType;

public record MessageEvent<T>(
        MessageEventType type,
        T data
) {
}
