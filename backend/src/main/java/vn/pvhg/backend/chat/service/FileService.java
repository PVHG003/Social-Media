package vn.pvhg.backend.chat.service;

import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.chat.dto.response.AttachmentResponse;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;

import java.util.List;
import java.util.UUID;

public interface FileService {
    ChatDetailResponse uploadGroupImage(UUID currentUserId, UUID chatId, MultipartFile file);

    List<AttachmentResponse> uploadAttachments(UUID currentUserId, String chatId, List<MultipartFile> files);
}
