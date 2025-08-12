package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.chat.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
}