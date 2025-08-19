import { useAuth } from "@/context/authContext";
import { useChat } from "@/context/chatContext";
import { useEffect, type FunctionComponent } from "react";

interface MessageListProps {
  scrollToBottom?: () => void;
}

const MessageList: FunctionComponent<MessageListProps> = ({
  scrollToBottom,
}) => {
  const { currentUser } = useAuth();
  const { chatMessages } = useChat();

  useEffect(() => {
    scrollToBottom?.();
  }, [chatMessages, scrollToBottom]);

  // Update currentChatId whenever route param changes
  return (
    <div className="p-4">
      {chatMessages?.length === 0 && <p>Chat messages will show here...</p>}{" "}
      {chatMessages?.map((message) => (
        <div
          key={message.messageId}
          className={`flex mb-2 ${
            message.senderId === currentUser?.id
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div>
            <h2 className="font-semibold mr-1">{message.senderUsername}</h2>
            <div
              className={`max-w-xs p-2 break-words ${
                message.senderId === currentUser?.id
                  ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg"
                  : "bg-gray-200 text-black rounded-r-lg rounded-tl-lg"
              }`}
            >
              <span>{message.content}</span>
            </div>
          </div>
        </div>
      ))}{" "}
    </div>
  );
};

export default MessageList;
