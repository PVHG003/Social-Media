package vn.pvhg.backend.post.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.post.service.MediaService;
import vn.pvhg.backend.post.model.PostMedia;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class MediaServiceImpl implements MediaService {

    @Value("${file.image-upload}")
    private String imageUploadDir;

    @Value("${file.video-upload}")
    private String videoUploadDir;

    @Override
    public PostMedia saveMedia(MultipartFile file, int position) {
        try {
            PostMedia.MediaType mediaType = determineMediaType(file.getContentType());
            String uploadDir = getUploadDirByMediaType(mediaType);

            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String newFilename = UUID.randomUUID().toString() + fileExtension;

            String dateFolder = LocalDate.now().toString();
            Path uploadPath = Paths.get(uploadDir, dateFolder);
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            String relativePath = uploadDir + dateFolder + "/" + newFilename;

            PostMedia postMedia = new PostMedia();
            postMedia.setOriginalFilename(originalFilename);
            postMedia.setStoragePath(relativePath);
            postMedia.setFileSize(file.getSize());
            postMedia.setMimeType(file.getContentType());
            postMedia.setPosition(position);
            postMedia.setMediaType(mediaType);

            log.info("Saved media file: {} to {}", originalFilename, relativePath);
            return postMedia;

        } catch (IOException e) {
            log.error("Error saving media file: {}", e.getMessage());
            throw new RuntimeException("Failed to save media file", e);
        }
    }

    @Override
    public List<PostMedia> saveMultipleMedia(List<MultipartFile> files) {
        List<PostMedia> mediaList = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            if (!file.isEmpty()) {
                PostMedia media = saveMedia(file, i);
                mediaList.add(media);
            }
        }
        return mediaList;
    }

    @Override
    public void deleteMedia(String storagePath) {
        try {
            Path path = Paths.get(storagePath);
            Files.deleteIfExists(path);
            log.info("Deleted media file: {}", storagePath);
        } catch (IOException e) {
            log.error("Error deleting media file: {}", e.getMessage());
        }
    }

    @Override
    public String getPublicUrl(String storagePath) {
        return "/" + storagePath;
    }

    private String getUploadDirByMediaType(PostMedia.MediaType mediaType) {
        switch (mediaType) {
            case IMAGE:
            case GIF:
                return imageUploadDir;
            case VIDEO:
                return videoUploadDir;
            case DOCUMENT:
            default:
                return imageUploadDir;
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }

    private PostMedia.MediaType determineMediaType(String mimeType) {
        if (mimeType == null) {
            return PostMedia.MediaType.DOCUMENT;
        }

        if (mimeType.equals("image/gif")) {
            return PostMedia.MediaType.GIF;
        } else if (mimeType.startsWith("image/")) {
            return PostMedia.MediaType.IMAGE;
        } else if (mimeType.startsWith("video/")) {
            return PostMedia.MediaType.VIDEO;
        }
        return PostMedia.MediaType.DOCUMENT;
    }
}