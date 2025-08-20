package vn.pvhg.backend.chat.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.auth.hung.model.User;
import vn.pvhg.backend.chat.dto.response.AttachmentResponse;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.enums.FileState;
import vn.pvhg.backend.chat.enums.MemberRole;
import vn.pvhg.backend.chat.exception.*;
import vn.pvhg.backend.chat.mapper.AttachmentMapper;
import vn.pvhg.backend.chat.mapper.ChatMapper;
import vn.pvhg.backend.chat.model.Attachment;
import vn.pvhg.backend.chat.model.Chat;
import vn.pvhg.backend.chat.repository.AttachmentRepository;
import vn.pvhg.backend.chat.repository.ChatRepository;
import vn.pvhg.backend.chat.service.FileService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private final ChatRepository chatRepository;
    private final ChatMapper chatMapper;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapper attachmentMapper;

    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    @Override
    public ChatDetailResponse uploadGroupImage(UUID currentUserId, UUID chatId, MultipartFile file) {
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
            log.info("Directory created: {}", dir.toAbsolutePath());

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            String relativePath = dir.resolve(fileName).toString();
            log.info("File saved to: {}", relativePath);

            chat.setGroupImage(relativePath);
            Chat savedChat = chatRepository.save(chat);

            return chatMapper.toChatDetailResponse(currentUserId, savedChat, savedChat.getMembers());
        } catch (IOException e) {
            log.error("Failed to save file to {}", target.toAbsolutePath(), e);
            throw new FileCreationException("Failed to save group image", e);
        }
    }

    @Override
    public List<AttachmentResponse> uploadAttachments(UUID currentUserId, String chatId, List<MultipartFile> files) {

        if (files == null || files.isEmpty()) {
            throw new InvalidFileException("File is empty or missing");
        }

        List<Attachment> attachments = files.stream().map(file -> {
            Path dir = makeDir(currentUserId.toString(), "chats", chatId, "attachments");
            String fileName = sanitizeFilename(file);
            Path target = dir.resolve(fileName);

            try {
                Files.createDirectories(dir);

                try (InputStream in = file.getInputStream()) {
                    Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
                }
                String relativePath = dir.resolve(fileName).toString();

                return Attachment.builder()
                        .fileName(fileName)
                        .filePath(relativePath)
                        .contentType(file.getContentType())
                        .uploader(User.builder().id(currentUserId).build())
                        .fileState(FileState.TEMPORARY)
                        .build();
            } catch (IOException e) {
                log.error("Failed to save file to {}", target.toAbsolutePath(), e);
                throw new FileCreationException("Failed to save group image", e);
            }
        }).toList();

        List<Attachment> savedAttachments = attachmentRepository.saveAll(attachments);

        return savedAttachments.stream()
                .map(attachmentMapper::toAttachmentResponse)
                .toList();
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
