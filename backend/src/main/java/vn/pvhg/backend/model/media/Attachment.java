package vn.pvhg.backend.model.media;

import jakarta.persistence.*;
import lombok.*;
import vn.pvhg.backend.model.chat.Message;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;   // S3 URL, local path, etc.
    private String type;  // "image", "video", "file", etc.

    @ManyToOne(optional = false)
    @JoinColumn(name = "message_id")
    private Message message;
}