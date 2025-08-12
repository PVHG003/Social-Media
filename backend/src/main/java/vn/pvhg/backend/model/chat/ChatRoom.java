package vn.pvhg.backend.model.chat;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.model.user.User;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // "DIRECT" or "GROUP"

    private String name; // auto generated with usernames or set manually

    private String coverImage; // Group chat icon

    @ManyToMany
    @JoinTable(
            name = "chat_room_members",
            joinColumns = @JoinColumn(name = "chat_room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy(value = "sentAt DESC")
    private Set<Message> messages = new HashSet<>();

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
