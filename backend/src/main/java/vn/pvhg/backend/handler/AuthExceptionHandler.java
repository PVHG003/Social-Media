package vn.pvhg.backend.handler;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.pvhg.backend.exception.auth.*;
import vn.pvhg.backend.response.ErrorResponse;

import java.util.Map;

@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException e) {
        String error = e.getMessage();
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST, "Email already exists", error);
        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ErrorResponse> handlePasswordMismatchException(PasswordMismatchException e) {
        String error = e.getMessage();
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST, "Passwords mismatch", error);
        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException e) {
        String error = e.getMessage();
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid credentials", error);
        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOperationException(InvalidOperationException e) {
        String error = e.getMessage();
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid operation", error);
        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccountNotVerifiedException.class)
    public ResponseEntity<ErrorResponse> handleAccountNotVerifiedException(AccountNotVerifiedException e) {
        String error = e.getMessage();
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid operation", error);
        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MailSendingException.class)
    public ResponseEntity<ErrorResponse> handleMailSendingException(MailSendingException e) {
        String error = e.getMessage();
        String cause = e.getCause().getMessage();
        Map<String, Object> errors = Map.of("error", error, "cause", cause);
        ErrorResponse response = new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid operation", errors);
        return new ResponseEntity<>(response, new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
}
