package vn.pvhg.backend.chat.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.chat.enums.MediaType;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "temp_medias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TempMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    private String fileName;

    private String filePath;

    @Enumerated(EnumType.STRING)
    private MediaType mediaType;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}
