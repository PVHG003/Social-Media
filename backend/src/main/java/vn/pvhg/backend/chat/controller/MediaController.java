package vn.pvhg.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.chat.dto.response.AttachmentResponse;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;
import vn.pvhg.backend.chat.service.FileService;
import vn.pvhg.backend.response.ApiResponse;

import java.util.List;
import java.util.UUID;

//TODO: sample codes implement later
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class MediaController {

    private final FileService fileService;

    @PostMapping(path = "/chats/{chatId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadAttachments(
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable String chatId
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        List<AttachmentResponse> attachmentResponse = fileService.uploadAttachments(currentUserId, chatId, files);
        ApiResponse<List<AttachmentResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Upload attachments success",
                true,
                attachmentResponse
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping(path = "/chats/{chatId}/group-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ChatDetailResponse>> uploadGroupImage(
            @PathVariable UUID chatId,
            @RequestParam("files") MultipartFile file,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        ChatDetailResponse chatDetail = fileService.uploadGroupImage(currentUserId, chatId, file);
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Upload group image success",
                true,
                chatDetail);

        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Object> getFile(@PathVariable String fileName) {
        return ResponseEntity.ok().build();
    }
}
