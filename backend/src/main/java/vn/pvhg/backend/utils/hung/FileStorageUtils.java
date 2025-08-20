package vn.pvhg.backend.utils.hung;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileStorageUtils {

    @Value("${application.file.uploads.media-output-path}")
    private String uploadDir;

    public String saveFile(MultipartFile file, String... subDir) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (file.getContentType().matches("image/*")) {
            throw new IllegalArgumentException("Content type not supported");
        }
        try {
            Path targetDir = Paths.get(uploadDir, subDir);
            Files.createDirectories(targetDir);

            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String uniqueName = UUID.randomUUID() + (extension != null ? "." + extension : "");
            Path filePath = targetDir.resolve(uniqueName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
