package vn.pvhg.backend.dto.request.post;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Data
public class PostRequest {
    private String content;
    private List<MultipartFile> mediaFiles;
}
