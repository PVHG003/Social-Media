package vn.pvhg.backend.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.pvhg.backend.post.model.Post;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
}
