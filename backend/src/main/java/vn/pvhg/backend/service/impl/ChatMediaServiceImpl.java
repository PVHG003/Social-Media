package vn.pvhg.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.response.chat.AttachmentResponse;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.enums.ChatType;
import vn.pvhg.backend.enums.FileState;
import vn.pvhg.backend.enums.MemberRole;
import vn.pvhg.backend.exception.chat.*;
import vn.pvhg.backend.mapper.AttachmentMapper;
import vn.pvhg.backend.mapper.ChatMapper;
import vn.pvhg.backend.model.User;
import vn.pvhg.backend.model.chat.Chat;
import vn.pvhg.backend.model.chat.ChatAttachment;
import vn.pvhg.backend.repository.ChatAttachmentRepository;
import vn.pvhg.backend.repository.ChatRepository;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.ChatMediaService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatMediaServiceImpl implements ChatMediaService {
    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;
    private final ChatAttachmentRepository chatAttachmentRepository;
    private final AttachmentMapper attachmentMapper;

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    @Override
    public List<AttachmentResponse> uploadAttachments(UserDetailsImpl userDetails, UUID chatId, List<MultipartFile> files) {
        UUID currentUserId = userDetails.getUser().getId();

        if (files == null || files.isEmpty()) {
            throw new InvalidFileException("File is empty or missing");
        }

        List<ChatAttachment> attachments = files.stream().map(file -> {
            Path dir = makeDir(currentUserId.toString(), "chats", chatId.toString(), "attachments");
            String fileName = sanitizeFilename(file);
            Path target = dir.resolve(fileName);

            try {
                Files.createDirectories(dir);

                try (InputStream in = file.getInputStream()) {
                    Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
                }
                String relativePath = dir.resolve(fileName).toString();

                return ChatAttachment.builder()
                        .fileName(fileName)
                        .filePath(relativePath)
                        .contentType(file.getContentType())
                        .uploader(User.builder().id(currentUserId).build())
                        .fileState(FileState.TEMPORARY)
                        .build();
            } catch (IOException e) {
                throw new FileCreationException("Failed to save group image", e);
            }
        }).toList();

        List<ChatAttachment> savedAttachments = chatAttachmentRepository.saveAll(attachments);

        return savedAttachments.stream()
                .map(attachmentMapper::toAttachmentResponse)
                .toList();
    }

    @Override
    public ChatDetailResponse uploadGroupImage(UserDetailsImpl userDetails, UUID chatId, MultipartFile file) {
        UUID currentUserId = userDetails.getUser().getId();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ChatNotFoundException("Chat id " + chatId + " not found"));

        if (chat.getChatType() != ChatType.GROUP) {
            throw new InvalidChatTypeException("Chat id " + chatId + " is not a group chat");
        }

        boolean isAdmin = chat.getMembers().stream()
                .anyMatch(m -> m.getMember().getId().equals(currentUserId) && m.getRole() == MemberRole.ADMIN);
        if (!isAdmin) {
            throw new NotChatAdminException("Only admins can update the group image");
        }

        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is empty or missing");
        }

        Path dir = makeDir(currentUserId.toString(), "chats", chatId.toString(), "group-image");
        String fileName = sanitizeFilename(file);
        Path target = dir.resolve(fileName);

        try {
            Files.createDirectories(dir);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            String relativePath = dir.resolve(fileName).toString();

            chat.setGroupImage(relativePath);
            Chat savedChat = chatRepository.save(chat);

            return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedChat.getMembers());
        } catch (IOException e) {
            throw new FileCreationException("Failed to save group image", e);
        }

    }

    private String sanitizeFilename(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String safeName = UUID.randomUUID().toString();
        return safeName + extension;
    }

    private Path makeDir(String... subDir) {
        return Paths.get(fileUploadPath, subDir);
    }
}
