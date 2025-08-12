package vn.pvhg.backend.model.interaction;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.pvhg.backend.model.post.Post;
import vn.pvhg.backend.model.user.User;

import java.time.Instant;

@Entity
@Table(name = "comments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @CreationTimestamp
    private Instant commentedAt;

    @UpdateTimestamp
    private Instant updatedAt;
}