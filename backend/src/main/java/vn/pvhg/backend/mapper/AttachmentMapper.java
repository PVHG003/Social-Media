package vn.pvhg.backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.dto.response.chat.AttachmentResponse;
import vn.pvhg.backend.model.chat.ChatAttachment;

@Component
@RequiredArgsConstructor
public class AttachmentMapper {
    public AttachmentResponse toAttachmentResponse(ChatAttachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFilePath(),
                attachment.getContentType(),
                attachment.getUploader().getId(),
                attachment.getUploadedAt()
        );
    }
}
