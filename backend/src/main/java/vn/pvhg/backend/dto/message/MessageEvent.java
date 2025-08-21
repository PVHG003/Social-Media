package vn.pvhg.backend.dto.message;

import vn.pvhg.backend.enums.MessageEventType;

public record MessageEvent<T>(
        MessageEventType eventType,
        T data
) {
}
