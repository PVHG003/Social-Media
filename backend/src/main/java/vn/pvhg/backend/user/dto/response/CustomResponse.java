package vn.pvhg.backend.user.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@JsonPropertyOrder({"data", "message", "success"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomResponse<T> implements Serializable {
    private T data;
    private String message;
    private boolean success;

    public CustomResponse(boolean success, T data, String message) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public CustomResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    public CustomResponse(boolean success) {
        this.success = success;
    }
}
