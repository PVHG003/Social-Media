package vn.pvhg.backend.exception.chat;

public class NotChatMemberException extends RuntimeException {
    public NotChatMemberException(String message) {
        super(message);
    }
}
