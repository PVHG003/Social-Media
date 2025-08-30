package vn.pvhg.backend.service;

import vn.pvhg.backend.model.Notification;

import java.util.List;

public interface NotificationService {
    void createAndSend(Notification notification);

    void createAndSendBulk(List<Notification> notifications);
}
