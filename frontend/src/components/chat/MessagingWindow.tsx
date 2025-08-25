import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import MessageHeader from "./MessageHeader";
import { useChat } from "@/context/chat/ChatContext";

const MessagingWindow = () => {
  const { currentChatId, messages } = useChat();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on mount and whenever new messages appear
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChatId]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-5 border-b">
        <MessageHeader />
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-5">
        <MessageList scrollToBottom={scrollToBottom} />
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default MessagingWindow;
