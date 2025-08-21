package vn.pvhg.backend.service;

import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.response.chat.AttachmentResponse;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.security.UserDetailsImpl;

import java.util.List;
import java.util.UUID;

public interface ChatMediaService {
    List<AttachmentResponse> uploadAttachments(UserDetailsImpl userDetails, UUID chatId, List<MultipartFile> files);

    ChatDetailResponse uploadGroupImage(UserDetailsImpl userDetails, UUID chatId, MultipartFile file);
}
