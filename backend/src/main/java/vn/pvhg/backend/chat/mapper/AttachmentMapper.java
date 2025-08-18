package vn.pvhg.backend.chat.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.chat.dto.response.AttachmentResponse;
import vn.pvhg.backend.chat.model.Attachment;

@Service
@RequiredArgsConstructor
public class AttachmentMapper {

    public AttachmentResponse toAttachmentResponse(Attachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFilePath(),
                attachment.getContentType(),
                attachment.getUploader().getId(),
                attachment.getUploadedAt()
        );
    }
}
