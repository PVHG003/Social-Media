package vn.pvhg.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.dto.response.chat.AttachmentResponse;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.ChatMediaService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class ChatMediaController {

    private final ChatMediaService fileService;

    @PostMapping(path = "/chats/{chatId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<List<AttachmentResponse>>> uploadAttachments(
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID chatId
    ) {
        List<AttachmentResponse> attachmentResponse = fileService.uploadAttachments(userDetails, chatId, files);
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
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        ChatDetailResponse chatDetail = fileService.uploadGroupImage(userDetails, chatId, file);
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Upload group image success",
                true,
                chatDetail
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Object> getFile(@PathVariable String fileName) {
        return ResponseEntity.ok().build();
    }
}
