package vn.pvhg.backend.handler;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.pvhg.backend.exception.chat.FileCreationException;
import vn.pvhg.backend.exception.chat.FileNotFoundException;
import vn.pvhg.backend.exception.chat.InvalidFileException;
import vn.pvhg.backend.response.ErrorResponse;

@RestControllerAdvice
public class FileExceptionHandler {
    @ExceptionHandler(FileCreationException.class)
    public ResponseEntity<ErrorResponse> handleChatNotFound(FileCreationException ex) {
        String error = ex.getMessage();
        ErrorResponse apiError = new ErrorResponse(HttpStatus.NOT_FOUND, "Chat not found", error);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler(InvalidFileException.class)
    public ResponseEntity<ErrorResponse> handleInvalidFile(InvalidFileException ex) {
        String error = ex.getMessage();
        ErrorResponse apiError = new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid file", error);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleFileNotFound(FileNotFoundException ex) {
        String error = ex.getMessage();
        ErrorResponse apiError = new ErrorResponse(HttpStatus.NOT_FOUND, "File not found", error);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }
}