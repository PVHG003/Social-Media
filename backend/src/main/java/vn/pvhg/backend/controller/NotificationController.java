package vn.pvhg.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.pvhg.backend.dto.response.notification.NotificationResponse;
import vn.pvhg.backend.response.ApiPaginatedResponse;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {


    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiPaginatedResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<NotificationResponse> data = notificationService.getNotifications(userDetails, pageable);
        ApiPaginatedResponse<List<NotificationResponse>> response = new ApiPaginatedResponse<>(
                HttpStatus.OK,
                "",
                true,
                data.getContent(),
                pageable.getPageNumber(),
                pageable.getPageSize(),
                data.getTotalPages(),
                data.getNumberOfElements()
        );
        return new ResponseEntity<>(response, new HttpHeaders(), response.getStatus());
    }
}
