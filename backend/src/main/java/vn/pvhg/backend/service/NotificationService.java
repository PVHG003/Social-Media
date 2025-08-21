package vn.pvhg.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.pvhg.backend.dto.response.notification.NotificationResponse;
import vn.pvhg.backend.security.UserDetailsImpl;

public interface NotificationService {
    Page<NotificationResponse> getNotifications(UserDetailsImpl userDetails, Pageable pageable);
}
