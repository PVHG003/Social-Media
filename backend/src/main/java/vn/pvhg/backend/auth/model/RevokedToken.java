package vn.pvhg.backend.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "revoked_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevokedToken {
    @Id
    @Column(length = 512)
    private String tokenId;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant revokedAt;

    @Column(nullable = false)
    private Instant expiryDate;
}