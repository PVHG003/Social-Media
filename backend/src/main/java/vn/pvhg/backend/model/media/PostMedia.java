package vn.pvhg.backend.model.media;

import jakarta.persistence.*;
import lombok.*;
import vn.pvhg.backend.model.enums.MediaType;
import vn.pvhg.backend.model.post.Post;

@Entity
@Table(name = "post_media")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MediaType type;
}