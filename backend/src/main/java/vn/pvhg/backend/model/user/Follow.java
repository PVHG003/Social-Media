package vn.pvhg.backend.model.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "follows",
        uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "following_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne(optional = false)
    @JoinColumn(name = "following_id")
    private User following;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant followedAt;
}