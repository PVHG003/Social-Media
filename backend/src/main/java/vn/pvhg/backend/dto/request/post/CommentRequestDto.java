package vn.pvhg.backend.dto.request.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequestDto {

    @NotBlank(message = "Content cannot be blank")
    @Size(max = 1000, message = "Content must not exceed 1000 characters")
    private String content;
}
