import { useChat } from "@/context/chat/ChatContext";
import { useAuth } from "@/context/chat/test/AuthContext";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

interface MessageListProps {
  scrollToBottom?: () => void;
}

const MessageList: FunctionComponent<MessageListProps> = ({
  scrollToBottom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { authenticated, currentUser } = useAuth();
  const { chatMessages, fetchChatMessages, hasMoreMessages, chatPage } =
    useChat();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    scrollToBottom?.();
  }, [chatMessages, scrollToBottom]);

  const handleScroll = async () => {
    if (!containerRef.current || isFetching || !hasMoreMessages) return;

    if (containerRef.current.scrollTop < 100) {
      setIsFetching(true);
      await fetchChatMessages(chatPage + 1, true); // load older messages
      setIsFetching(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Please log in to view messages.</p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="p-4 flex flex-col gap-2 overflow-y-auto"
      style={{ height: "100%" }}
      onScroll={handleScroll}
    >
      {isFetching && (
        <p className="text-gray-400 text-sm text-center">Loading...</p>
      )}

      {chatMessages?.length === 0 && (
        <p className="text-gray-500">Chat messages will show here...</p>
      )}

      {chatMessages?.map((message) => {
        const isCurrentUser = message.senderId === currentUser?.id;
        return (
          <div
            key={message.messageId}
            className={`flex mb-2 items-end ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src={message.senderProfileImage}
                  alt={message.senderUsername}
                />
                <AvatarFallback>
                  {message.senderUsername?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div>
              {!isCurrentUser && (
                <h2 className="font-semibold text-sm mb-1">
                  {message.senderUsername}
                </h2>
              )}

              <div
                className={`max-w-md p-2 break-words space-y-2 ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg"
                    : "bg-gray-200 text-black rounded-r-lg rounded-tl-lg"
                }`}
              >
                {/* Text content */}
                {message.content && <span>{message.content}</span>}

                {/* Attachments */}
                <div
                  className={`grid gap-4 mt-2 ${
                    message.attachments?.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  }`}
                >
                  {message.attachments?.map((att, idx) => {
                    if (att.contentType?.match("image/.*")) {
                      return (
                        <img
                          key={idx}
                          src={`http://localhost:8080/${att.filePath}`}
                          alt={att.attachmentId || "image"}
                          className={`w-full object-cover rounded ${
                            message.attachments?.length === 1 ? "h-96" : "h-64"
                          }`}
                        />
                      );
                    } else if (att.contentType?.match("video/.*")) {
                      return (
                        <div
                          key={idx}
                          className={`w-full rounded overflow-hidden ${
                            message.attachments?.length === 1
                              ? "max-h-[480px]"
                              : "max-h-[320px]"
                          } aspect-video`}
                        >
                          <video
                            src={`http://localhost:8080/${att.filePath}`}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    } else if (att.contentType?.match(".*/.*")) {
                      return (
                        <a
                          key={idx}
                          href={`http://localhost:8080/${att.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex items-center justify-center border rounded text-sm underline"
                        >
                          📄 {att.attachmentId || "Document"}
                        </a>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            {isCurrentUser && (
              <Avatar className="h-8 w-8 ml-2">
                <AvatarImage
                  src={currentUser?.profileImagePath}
                  alt={currentUser?.username}
                />
                <AvatarFallback>
                  {currentUser?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
