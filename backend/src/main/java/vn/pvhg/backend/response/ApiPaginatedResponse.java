package vn.pvhg.backend.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApiPaginatedResponse<T> {
    HttpStatus status;
    String message;
    boolean success;
    T data;
    int page;
    int pageSize;
    int totalPages;
    int totalElements;

    public ApiPaginatedResponse(HttpStatus status, String message, boolean success, T data, int page, int pageSize, int totalPages, int totalElements) {
        this.status = status;
        this.message = message;
        this.success = success;
        this.data = data;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }
}
