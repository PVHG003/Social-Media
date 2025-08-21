package vn.pvhg.backend.exception.chat;

public class NotChatAdminException extends RuntimeException {
    public NotChatAdminException(String message) {
        super(message);
    }
}
