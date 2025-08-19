package vn.pvhg.backend.notification.exception.handler;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import vn.pvhg.backend.notification.exception.NotificationNotFoundException;
import vn.pvhg.backend.response.ApiError;

@RestControllerAdvice
public class NotificationExceptionHandler {
    @ExceptionHandler(NotificationNotFoundException.class)
    public ResponseEntity<ApiError> handleNotificationNotFoundException(NotificationNotFoundException ex) {
        String message = ex.getMessage();
        ApiError response = new ApiError(HttpStatus.NOT_FOUND, "Notification not found", message);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }
}
