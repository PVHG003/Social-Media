import MessagingWindow from "@/components/chat/MessagingWindow";
import { useChat } from "@/context/chat/ChatContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { setCurrentChatId, chats } = useChat();

  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId || chats[0]?.chatId || null);
    }
  }, [chatId, setCurrentChatId]);

  return <MessagingWindow />;
};

export default ChatPage;
