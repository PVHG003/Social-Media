package vn.pvhg.backend.chat.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.auth.model.User;
import vn.pvhg.backend.chat.enums.AttachmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    private String fileName;

    private String filePath;

    //    @Enumerated(EnumType.STRING)
    private String mediaType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AttachmentStatus status = AttachmentStatus.TEMPORARY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    @ManyToOne
    @JoinColumn(name = "message_id")
    private Message message;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}