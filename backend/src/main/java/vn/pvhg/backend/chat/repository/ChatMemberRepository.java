package vn.pvhg.backend.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.pvhg.backend.chat.model.ChatMember;

import java.util.List;
import java.util.UUID;

public interface ChatMemberRepository extends JpaRepository<ChatMember, UUID> {
    List<ChatMember> findByChatId(UUID chatId);
}