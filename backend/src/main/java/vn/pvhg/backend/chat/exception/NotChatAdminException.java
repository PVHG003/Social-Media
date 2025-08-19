package vn.pvhg.backend.chat.exception;

public class NotChatAdminException extends RuntimeException {
    public NotChatAdminException(String message) {
        super(message);
    }
}
