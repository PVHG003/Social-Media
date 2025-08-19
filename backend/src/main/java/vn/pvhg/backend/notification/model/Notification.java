package vn.pvhg.backend.notification.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.notification.enums.NotificationType;

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
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false)
    private UUID recipientId; // who receives it

    private UUID actorId;     // who triggered (optional)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    private UUID entityId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private boolean isRead = false;
}
