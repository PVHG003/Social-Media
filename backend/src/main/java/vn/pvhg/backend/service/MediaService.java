package vn.pvhg.backend.service;

import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.model.media.PostMedia;

import java.util.List;

public interface MediaService {
    PostMedia saveMedia(MultipartFile file, int position);

    List<PostMedia> saveMultipleMedia(List<MultipartFile> files);

    void deleteMedia(String storagePath);

    String getPublicUrl(String storagePath);
}
