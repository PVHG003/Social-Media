package vn.pvhg.backend.post.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class PostRequestDto {
    private String content;
    private List<MultipartFile> mediaFiles;
}