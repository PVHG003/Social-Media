package vn.pvhg.backend.model.chat;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.model.media.Attachment;
import vn.pvhg.backend.model.user.User;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments = new ArrayList<>();

    @Column(nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant sentAt;
}
