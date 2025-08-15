package vn.pvhg.backend.chat.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.chat.dto.response.AttachmentDto;
import vn.pvhg.backend.chat.service.MessageMediaService;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class MessageMediaController {
    private final MessageMediaService messageMediaService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @PostMapping(path = "/attachments/temp", consumes = {"multipart/form-data"}, produces = {"application/json"})
    public ResponseEntity<ApiResponse<List<AttachmentDto>>> uploadTempAttachment(
            @RequestPart("files") List<MultipartFile> files,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        List<AttachmentDto> attachments = messageMediaService.uploadTempAttachment(userDetails.getUser().getId(), files);
        ApiResponse<List<AttachmentDto>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Upload attachment success",
                true,
                attachments
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }
}
