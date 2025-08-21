package vn.pvhg.backend.controller;

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
import org.springframework.web.bind.annotation.*;
import vn.pvhg.backend.dto.request.chat.AddMembersRequest;
import vn.pvhg.backend.dto.request.chat.ChatCreateRequest;
import vn.pvhg.backend.dto.request.chat.ChatUpdateRequest;
import vn.pvhg.backend.dto.response.chat.ChatDetailResponse;
import vn.pvhg.backend.dto.response.chat.ChatListResponse;
import vn.pvhg.backend.dto.response.chat.ChatMessageResponse;
import vn.pvhg.backend.enums.ChatType;
import vn.pvhg.backend.response.ApiPaginatedResponse;
import vn.pvhg.backend.response.ApiResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.ChatService;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;


    @GetMapping
    public ResponseEntity<ApiPaginatedResponse<List<ChatListResponse>>> getChatList(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ChatListResponse> chatList = chatService.getChatList(userDetails, pageable);
        ApiPaginatedResponse<List<ChatListResponse>> response = new ApiPaginatedResponse<>(
                HttpStatus.OK,
                "Get messages successful for user " + userDetails.getUser().getUsername(),
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
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        ChatDetailResponse chatDetail = chatService.getChatInfo(userDetails, chatId);
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(HttpStatus.OK, "Get chat info success", true, chatDetail);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ApiPaginatedResponse<List<ChatMessageResponse>>> getChatMessages(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(page = 0, size = 10, sort = "sentAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ChatMessageResponse> chatMessageList = chatService.getChatMessages(userDetails, chatId, pageable);
        ApiPaginatedResponse<List<ChatMessageResponse>> response = new ApiPaginatedResponse<>(
                HttpStatus.OK,
                "Get messages successful for user " + userDetails.getUser().getUsername(),
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
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        ChatDetailResponse chatDetail = null;

        log.info("Chat detail: {}", request.chatType());
        if (request.chatType() == ChatType.PRIVATE) {
            chatDetail = chatService.createPrivateChat(userDetails, request);
        }
        if (request.chatType() == ChatType.GROUP) {
            chatDetail = chatService.createGroupChat(userDetails, request);
        }

        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(HttpStatus.OK, "Create chat success", true, chatDetail);
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @PostMapping("/{chatId}/members")
    public ResponseEntity<ApiResponse<ChatDetailResponse>> addMembers(
            @PathVariable UUID chatId,
            @RequestBody AddMembersRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        ChatDetailResponse chatDetail = chatService.addMembers(userDetails, chatId, request.userIds());
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(HttpStatus.OK, "Add members success", true, chatDetail);

        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    // Not implemented yet
    @PutMapping("/{chatId}")
    public ResponseEntity<ApiResponse<ChatDetailResponse>> updateChat(
            @PathVariable UUID chatId,
            @RequestBody ChatUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        ChatDetailResponse updatedChat = chatService.updateChat(userDetails, chatId, request);
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Update chat success",
                true,
                updatedChat
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @DeleteMapping("/{chatId}")
    public ResponseEntity<ApiResponse<Void>> deleteChat(
            @PathVariable UUID chatId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        chatService.deleteChat(userDetails, chatId);
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.NO_CONTENT,
                "Delete chat success",
                true,
                null
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }

    @DeleteMapping("/{chatId}/members/{memberId}")
    public ResponseEntity<ApiResponse<ChatDetailResponse>> removeMember(
            @PathVariable UUID chatId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        ChatDetailResponse updatedChat = chatService.removeMember(userDetails, chatId, memberId);
        ApiResponse<ChatDetailResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Remove member success",
                true,
                updatedChat
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }
}