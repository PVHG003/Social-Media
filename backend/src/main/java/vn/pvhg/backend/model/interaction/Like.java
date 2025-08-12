package vn.pvhg.backend.model.interaction;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.model.post.Post;
import vn.pvhg.backend.model.user.User;

import java.time.Instant;

@Entity
@Table(name = "likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "post_id")
    private Post post;

    @CreationTimestamp
    private Instant likedAt;
}