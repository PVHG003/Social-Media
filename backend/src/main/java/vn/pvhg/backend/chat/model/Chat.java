package vn.pvhg.backend.chat.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.pvhg.backend.auth.model.User;
import vn.pvhg.backend.chat.enums.ChatType;
import vn.pvhg.backend.chat.enums.MessageState;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "chats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "chat_type", nullable = false)
    private ChatType chatType;

    @Column(name = "group_name")
    private String groupName;

    @Column(name = "group_image_url")
    private String groupImage;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ChatParticipant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "chat", fetch = FetchType.LAZY)
    @OrderBy("sentAt DESC")
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean deleted = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    public boolean isPrivate() {
        return chatType == ChatType.PRIVATE;
    }

    @Transient
    public String getChatDisplayName(UUID userId) {
        if (isPrivate()) {
            return participants.stream()
                    .map(ChatParticipant::getUser)
                    .filter(user -> !user.getId().equals(userId))
                    .findFirst()
                    .map(User::getUsername)
                    .orElse(null);
        }
        return groupName;
    }

    @Transient
    public String getChatDisplayImage(UUID userId) {
        if (isPrivate()) {
            return participants.stream()
                    .map(ChatParticipant::getUser)
                    .filter(user -> !user.getId().equals(userId))
                    .findFirst()
                    .map(User::getProfileImage)
                    .orElse(null);
        }
        return groupImage;
    }

    @Transient
    public long getUnreadCount(User user) {
        return messages.stream()
                .filter(m -> m.getState() == MessageState.SENT)
                .filter(m -> !m.getSender().equals(user))
                .count();
    }

    @Transient
    public MessagePreview getLastMessagePreview() {
        if (messages == null || messages.isEmpty()) {
            return null;
        }

        Message last = messages.getFirst();
        return MessagePreview.builder()
                .content(last.getAttachments().isEmpty() ? last.getContent() : "Attachment")
                .sentAt(last.getSentAt())
                .senderName(last.getSender().getUsername())
                .build();
    }

    public void addParticipant(User user, boolean isAdmin) {
        ChatParticipant participant = ChatParticipant.builder()
                .chat(this)
                .user(user)
                .isAdmin(isAdmin)
                .joinedAt(LocalDateTime.now())
                .build();
        participants.add(participant);
    }
}
