package vn.pvhg.backend.chat.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.auth.model.User;
import vn.pvhg.backend.chat.dto.response.AttachmentDto;
import vn.pvhg.backend.chat.enums.AttachmentStatus;
import vn.pvhg.backend.chat.model.Attachment;
import vn.pvhg.backend.chat.repository.AttachmentRepository;
import vn.pvhg.backend.chat.service.MessageMediaService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageMediaServiceImpl implements MessageMediaService {

    private final AttachmentRepository attachmentRepository;
    @Value("${application.file.uploads.media-output-path}")
    private String uploadDir; // uploads

    @Override
    public List<AttachmentDto> uploadTempAttachment(UUID currentUserId, List<MultipartFile> files) {

        Path dir = Paths.get(uploadDir, currentUserId.toString(), "attachments");
        List<Attachment> attachments = new ArrayList<>();
        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create directory", e);
        }
        List<AttachmentDto> result = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
                String uniqueName = UUID.randomUUID() + (extension != null ? "." + extension : "");
                Path filePath = dir.resolve(uniqueName);

                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                Attachment attachment = Attachment.builder()
                        .status(AttachmentStatus.TEMPORARY)
                        .fileName(file.getOriginalFilename())
                        .filePath(filePath.toString())
                        .mediaType(file.getContentType() != null ?
                                MediaType.parseMediaType(file.getContentType()).toString() :
                                MediaType.APPLICATION_OCTET_STREAM.toString())
                        .uploader(User.builder().id(currentUserId).build())
                        .build();

                attachmentRepository.save(attachment);

                result.add(new AttachmentDto(
                        attachment.getId(),
                        attachment.getFileName(),
                        attachment.getFilePath(),
                        attachment.getUploader().getId(),
                        attachment.getMediaType(),
                        attachment.getUploadedAt()
                ));
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }
        return result;
    }

    @Scheduled(cron = "0 * * * * *")
    @Override
    public void deleteTempAttachment() {
        List<Attachment> tempAttachments = attachmentRepository.findByStatus(AttachmentStatus.TEMPORARY);

        try {
            for (Attachment attachment : tempAttachments) {
                Files.deleteIfExists(Path.of(attachment.getFilePath()));
                attachmentRepository.delete(attachment);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
