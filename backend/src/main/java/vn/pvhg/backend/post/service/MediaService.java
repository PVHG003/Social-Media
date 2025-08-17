package vn.pvhg.backend.post.service;

import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.post.model.PostMedia;

import java.util.List;

public interface MediaService {
    PostMedia saveMedia(MultipartFile file, int position);

    List<PostMedia> saveMultipleMedia(List<MultipartFile> files);

    void deleteMedia(String storagePath);

    String getPublicUrl(String storagePath);
}