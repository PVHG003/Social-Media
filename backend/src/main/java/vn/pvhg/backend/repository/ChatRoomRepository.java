package vn.pvhg.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.model.chat.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
}