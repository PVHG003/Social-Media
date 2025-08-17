package vn.pvhg.backend.comment.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.pvhg.backend.comment.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

}
