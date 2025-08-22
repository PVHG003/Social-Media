import { useRef, type FunctionComponent } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface MessageWindowProps {}

const MessageWindow: FunctionComponent<MessageWindowProps> = () => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        <MessageList scrollToBottom={scrollToBottom} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input fixed at bottom */}
      <MessageInput onMessageSent={scrollToBottom} />
    </div>
  );
};

export default MessageWindow;
