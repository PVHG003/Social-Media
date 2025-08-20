package vn.pvhg.backend.chat.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.pvhg.backend.auth.hung.model.User;
import vn.pvhg.backend.chat.enums.MemberRole;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "chat_members",
        uniqueConstraints = @UniqueConstraint(columnNames = {"chat_id", "member_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MemberRole role = MemberRole.MEMBER;

    @Column(nullable = false)
    @Builder.Default
    private boolean hasLeft = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean muted = false;

    @Column(nullable = false)
    @Builder.Default
    private int unreadCount = 0;

    @CreationTimestamp
    private LocalDateTime joinedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime leftAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;
}
