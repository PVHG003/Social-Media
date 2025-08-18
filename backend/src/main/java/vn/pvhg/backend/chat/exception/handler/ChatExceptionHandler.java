package vn.pvhg.backend.chat.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.pvhg.backend.chat.exception.*;
import vn.pvhg.backend.response.ApiError;

@RestControllerAdvice
public class ChatExceptionHandler {

    @ExceptionHandler(ChatNotFoundException.class)
    public ResponseEntity<ApiError> handleChatNotFound(ChatNotFoundException ex) {
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND, "Chat not found", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(NotChatMemberException.class)
    public ResponseEntity<ApiError> handleNotChatMember(NotChatMemberException ex) {
        ApiError apiError = new ApiError(HttpStatus.FORBIDDEN, "User is not a member of this chat", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(ChatCreationException.class)
    public ResponseEntity<ApiError> handleChatCreation(ChatCreationException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "Chat creation error", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(NotChatAdminException.class)
    public ResponseEntity<ApiError> handleNotChatAdmin(NotChatAdminException ex) {
        ApiError apiError = new ApiError(HttpStatus.FORBIDDEN, "User is not an admin", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }

    @ExceptionHandler(InvalidChatTypeException.class)
    public ResponseEntity<ApiError> handleInvalidChatType(InvalidChatTypeException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "Invalid chat type", ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}