package vn.pvhg.backend.chat.service;

import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.chat.dto.response.AttachmentDto;

import java.util.List;
import java.util.UUID;

public interface MessageMediaService {
    List<AttachmentDto> uploadTempAttachment(UUID currentUserId, List<MultipartFile> files);

    void deleteTempAttachment();
}
