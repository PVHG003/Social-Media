import MessageBubble from "./MessageBubble";
import { useChat } from "@/context/chat/ChatContext";
import { useEffect } from "react";

const MessageList = ({ scrollToBottom }: { scrollToBottom: () => void }) => {
  const { messages, currentChatId, fetchMessages, loadingMessages } = useChat();

  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId]);

  return (
    <div className="p-4 flex flex-col gap-2">
      {loadingMessages ? (
        <p className="text-center text-gray-400 italic">Loading messages...</p>
      ) : messages.length > 0 ? (
        messages.map((msg) => (
          <MessageBubble
            key={msg.messageId}
            message={msg}
            scrollToBottom={scrollToBottom}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 italic">
          Begins the conversation...
        </p>
      )}
    </div>
  );
};

export default MessageList;
