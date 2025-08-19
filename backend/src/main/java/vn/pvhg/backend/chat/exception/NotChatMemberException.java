package vn.pvhg.backend.chat.exception;

public class NotChatMemberException extends RuntimeException {
    public NotChatMemberException(String message) {
        super(message);
    }
}
