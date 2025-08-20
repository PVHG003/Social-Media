package vn.pvhg.backend.model.media;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import vn.pvhg.backend.enums.MediaType;
import vn.pvhg.backend.model.Post;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "post_medias")
public class PostMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    private String originalFilename;

    private String storagePath;

    private long fileSize;

    private String mimeType;

    private int size;

    private Integer height;

    private Integer width;

    private Integer duration;

    private int position;

    private MediaType mediaType;

    private boolean deleted = false;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    private Instant deletedAt;
}