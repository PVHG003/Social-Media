package vn.pvhg.backend.model.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profileImage;

    private String coverImage;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private LocalDate birthday;

    @Column(nullable = false)
    private boolean accountNonExpired = true;

    @Column(nullable = false)
    private boolean accountNonLocked = true;

    @Column(nullable = false)
    private boolean credentialsNonExpired = true;

    @Column(nullable = false)
    private boolean enabled = true;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
