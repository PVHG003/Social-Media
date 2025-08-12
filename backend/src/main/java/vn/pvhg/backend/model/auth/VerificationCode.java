package vn.pvhg.backend.model.auth;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "verification_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Instant expiryDate;

    @Column(nullable = false)
    private boolean used = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
