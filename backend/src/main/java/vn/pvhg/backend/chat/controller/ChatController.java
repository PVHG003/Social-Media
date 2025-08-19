package vn.pvhg.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.chat.dto.request.AddMembersRequest;
import vn.pvhg.backend.chat.dto.request.ChatCreateRequest;
import vn.pvhg.backend.chat.dto.response.ChatDetailResponse;
import vn.pvhg.backend.chat.dto.response.ChatListResponse;
import vn.pvhg.backend.chat.dto.response.ChatMessageResponse;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.service.ChatService;
import vn.pvhg.backend.response.ApiPageResponse;
import vn.pvhg.backend.response.ApiResponse;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {

    private static final UUID testCurrentUserId = UUID.fromString("11111111-1111-1111-1111-111111111111");

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<ApiPageResponse<List<ChatListResponse>>> getChatList(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        Page<ChatListResponse> chatList = chatService.getChatList(currentUserId, pageable);
        ApiPageResponse<List<ChatListResponse>> response = new ApiPageResponse<>(
                HttpStatus.OK,
                "Get messages successful for user " + currentUserId,
                true,
                chatList.getContent(),
                pageable.getPageNumber(),
                pageable.getPageSize(),
                chatList.getTotalElements(),
                chatList.getTotalPages()
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ApiResponse<ChatDetailResponse>> getChatInfo(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        ChatDetailResponse chatDetail = chatService.getChatInfo(currentUserId, chatId);
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(HttpStatus.OK, "Get chat info success", true, chatDetail);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ApiPageResponse<List<ChatMessageResponse>>> getChatMessages(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 10, sort = "sentAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        Page<ChatMessageResponse> chatMessageList = chatService.getChatMessages(currentUserId, chatId, pageable);
        ApiPageResponse<List<ChatMessageResponse>> response = new ApiPageResponse<>(
                HttpStatus.OK,
                "Get messages successful for user " + currentUserId,
                true,
                chatMessageList.getContent(),
                pageable.getPageNumber(),
                pageable.getPageSize(),
                chatMessageList.getTotalElements(),
                chatMessageList.getTotalPages()
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ChatDetailResponse>> createChat(
            @RequestBody ChatCreateRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        ChatDetailResponse chatDetail = null;

        log.info("Chat detail: {}", request.chatType());
        if (request.chatType() == ChatType.PRIVATE) {
            chatDetail = chatService.createPrivateChat(currentUserId, request);
        }
        if (request.chatType() == ChatType.GROUP) {
            chatDetail = chatService.createGroupChat(currentUserId, request);
        }

        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(HttpStatus.OK, "Create chat success", true, chatDetail);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping("/{chatId}/members")
    public ResponseEntity<ApiResponse<ChatDetailResponse>> addMembers(
            @PathVariable UUID chatId,
            @RequestBody AddMembersRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID currentUserId = UUID.fromString(jwt.getClaims().get("uuid").toString());

        ChatDetailResponse chatDetail = chatService.addMembers(currentUserId, chatId, request.userIds());
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(HttpStatus.OK, "Add members success", true, chatDetail);

        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PutMapping("/{chatId}")
    public ResponseEntity<Object> updateChat(@PathVariable UUID chatId, @RequestBody Object request) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<Object> deleteChat(@PathVariable UUID chatId) {
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{chatId}/members/{memberId}")
    public ResponseEntity<Object> removeMember(@PathVariable UUID chatId, @PathVariable UUID memberId) {
        return ResponseEntity.ok().build();
    }
}
