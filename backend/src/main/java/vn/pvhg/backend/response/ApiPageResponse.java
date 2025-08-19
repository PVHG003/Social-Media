package vn.pvhg.backend.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApiPageResponse<T> {
    private HttpStatus status;
    private String message;
    private boolean success;
    private T data;
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Integer totalPages;

    public ApiPageResponse(HttpStatus status, String message, boolean success, T data, Integer page, Integer size, Long totalElements, Integer totalPages) {
        this.status = status;
        this.message = message;
        this.success = success;
        this.data = data;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }
}
