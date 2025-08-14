package vn.pvhg.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.pvhg.backend.chat.dto.request.ChatCreateRequest;
import vn.pvhg.backend.chat.dto.response.ChatDetailDto;
import vn.pvhg.backend.chat.dto.response.ChatListItemDto;
import vn.pvhg.backend.chat.dto.response.MessageDto;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.service.ChatService;
import vn.pvhg.backend.response.ApiPageResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ChatDetailDto>> createChat(
            @AuthenticationPrincipal Jwt jwt,
            @RequestPart ChatCreateRequest request,
            @RequestPart(name = "coverImage", required = false) MultipartFile coverImage
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        UUID userId = userDetails.getUser().getId();
        ApiResponse<ChatDetailDto> response = new ApiResponse<>();
        if (request.chatType() == ChatType.PRIVATE) {
            ChatDetailDto chatDetail = chatService.createPrivateChat(userId, request);
            response.setStatus(HttpStatus.OK);
            response.setMessage("Create private chat success");
            response.setSuccess(true);
            response.setData(chatDetail);

        }
        if (request.chatType() == ChatType.GROUP) {
            ChatDetailDto chatDetail = chatService.createGroupChat(userId, request);
            response.setStatus(HttpStatus.OK);
            response.setMessage("Create group chat success");
            response.setSuccess(true);
            response.setData(chatDetail);
        }
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping("/{chatId}/members")
    public ResponseEntity<ApiResponse<Void>> addMemberToChat(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam UUID userId
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        chatService.addMemberToChat(userDetails.getUser().getId(), chatId, userId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Add member to chat success",
                true,
                null
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping("/{chatId}/members/leave")
    public ResponseEntity<ApiResponse<Void>> leaveChat(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        chatService.leaveChat(userDetails.getUser().getId(), chatId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Leave chat success",
                true,
                null
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping
    public ResponseEntity<ApiPageResponse<List<ChatListItemDto>>> getChats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal Jwt jwt) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());

        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

        Page<ChatListItemDto> chatPage = chatService.getUserChats(userDetails.getUser().getId(), pageable);

        ApiPageResponse<List<ChatListItemDto>> response = new ApiPageResponse<>(
                HttpStatus.OK,
                "Get " + chatPage.getNumberOfElements() + " chats success",
                true,
                chatPage.getContent(),
                page,
                size,
                chatPage.getTotalElements(),
                chatPage.getTotalPages()
        );

        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<ChatDetailDto>> getChatDetail(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());

        ChatDetailDto chatDetail = chatService.getChatDetail(userDetails.getUser().getId(), chatId);

        ApiResponse<ChatDetailDto> response = new ApiResponse<>(
                HttpStatus.OK,
                "Get chat detail success",
                true,
                chatDetail
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ApiPageResponse<Page<MessageDto>>> getChatMessages(
            @PathVariable UUID chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        UUID userId = userDetails.getUser().getId();

        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());

        Page<MessageDto> messagePage = chatService.getChatMessages(userId, chatId, pageable);

        ApiPageResponse<Page<MessageDto>> response = new ApiPageResponse<>(
                HttpStatus.OK,
                "Get " + messagePage.getNumberOfElements() + " messages success",
                true,
                messagePage,
                page,
                size,
                messagePage.getTotalElements(),
                messagePage.getTotalPages()
        );

        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<ApiResponse<Void>> deleteChat(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        chatService.deleteChat(userDetails.getUser().getId(), chatId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Delete chat success",
                true,
                null
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }
}
