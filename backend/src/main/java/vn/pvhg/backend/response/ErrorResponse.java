package vn.pvhg.backend.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Getter
@Setter
public class ErrorResponse {

    HttpStatus status;
    String message;
    Map<String, Object> errors;

    public ErrorResponse(HttpStatus status, String message, Map<String, Object> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public ErrorResponse(HttpStatus status, String message, String error) {
        this.status = status;
        this.message = message;
        this.errors = Map.of("Error", error);
    }
}
