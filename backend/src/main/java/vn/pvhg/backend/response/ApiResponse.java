package vn.pvhg.backend.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApiResponse<T> {

    HttpStatus status;
    String message;
    boolean success;
    T data;

    public ApiResponse(HttpStatus status, String message, boolean success, T data) {
        this.status = status;
        this.message = message;
        this.success = success;
        this.data = data;
    }
}
