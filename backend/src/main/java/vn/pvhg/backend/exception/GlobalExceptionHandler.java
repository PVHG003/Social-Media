package vn.pvhg.backend.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import vn.pvhg.backend.response.ApiError;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiError> handleJwtException(JwtException e) {
        String error = e.getMessage();
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "JWT Exception", error);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        String error = ex.getName() + " should be of type " + Objects.requireNonNull(ex.getRequiredType()).getSimpleName();
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "Method Argument Type Mismatch Exception", error);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach((fieldError) -> {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        });
        ex.getBindingResult().getGlobalErrors().forEach((globalError) -> {
            errors.put(globalError.getObjectName(), globalError.getDefaultMessage());
        });
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, "Method Argument Not Valid Exception", errors);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex) {
        String error = ex.getMessage();
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Generic Exception", error);
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }
}