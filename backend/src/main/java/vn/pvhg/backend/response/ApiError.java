package vn.pvhg.backend.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.Map;

@Setter
@Getter
public class ApiError {
    private HttpStatus status;
    private String message;
    private Map<String, Object> errors;

    public ApiError(HttpStatus status, String message, Map<String, Object> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public ApiError(HttpStatus status, String message, String error) {
        this.status = status;
        this.message = message;
        this.errors = Map.of("error", error);
    }

}