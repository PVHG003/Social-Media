package vn.pvhg.backend.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.pvhg.backend.exception.chat.*;
import vn.pvhg.backend.response.ErrorResponse;

@RestControllerAdvice
public class ChatExceptionHandler {

    @ExceptionHandler(ChatNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleChatNotFound(ChatNotFoundException ex) {
        ErrorResponse apiError = new ErrorResponse(HttpStatus.NOT_FOUND, "Chat not found", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(NotChatMemberException.class)
    public ResponseEntity<ErrorResponse> handleNotChatMember(NotChatMemberException ex) {
        ErrorResponse apiError = new ErrorResponse(HttpStatus.FORBIDDEN, "User is not a member of this chat", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(ChatCreationException.class)
    public ResponseEntity<ErrorResponse> handleChatCreation(ChatCreationException ex) {
        ErrorResponse apiError = new ErrorResponse(HttpStatus.BAD_REQUEST, "Chat creation error", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(NotChatAdminException.class)
    public ResponseEntity<ErrorResponse> handleNotChatAdmin(NotChatAdminException ex) {
        ErrorResponse apiError = new ErrorResponse(HttpStatus.FORBIDDEN, "User is not an admin", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(InvalidChatTypeException.class)
    public ResponseEntity<ErrorResponse> handleInvalidChatType(InvalidChatTypeException ex) {
        ErrorResponse apiError = new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid chat type", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}