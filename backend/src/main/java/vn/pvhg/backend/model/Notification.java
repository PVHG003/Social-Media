package vn.pvhg.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.enums.NotificationEventType;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID recipientId; // who will receive the notification
    private UUID sourceUserId; // who triggered the notification (nullable for system events)

    @Enumerated(EnumType.STRING)
    private NotificationEventType type;

    private String content;

    private UUID referenceId;

    private boolean read = false; // read/unread status

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
