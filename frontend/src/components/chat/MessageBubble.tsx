import React from "react";
import type {ChatMessageResponse} from "@/api";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import clsx from "clsx";
import AttachmentGrid from "./AttachmentGrid";

interface MessageBubbleProps {
  message: ChatMessageResponse;
  scrollToBottom: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({message, scrollToBottom}) => {
  const userString = localStorage.getItem("user");
  const currentUserId = userString ? JSON.parse(userString).id : null;
  const isMe = message.senderId === currentUserId;

  return (
    <div
      className={clsx("flex items-end gap-2 mb-4", {
        "justify-end": isMe,
        "justify-start": !isMe,
      })}
    >
      {!isMe && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.senderProfileImage}/>
          <AvatarFallback>
            {message.senderUsername && message.senderUsername.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={clsx("max-w-xs flex flex-col gap-2", {
          "items-end": isMe,
          "items-start": !isMe,
        })}
      >
        {/* Sender name (only once, before bubble) */}
        {!isMe && (
          <span className="text-xs text-gray-500 mb-1">
            {message.senderUsername}
          </span>
        )}

        {/* Text bubble */}
        {message.content && (
          <div
            className={clsx(
              "rounded-lg px-4 py-2 text-sm shadow",
              isMe
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 rounded-bl-none"
            )}
          >
            {message.content}
          </div>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && message.attachments.map((attachment) => (
          <div className="mt-2 space-y-2">
            <AttachmentGrid
              attachment={attachment}
              onMediaLoad={scrollToBottom}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageBubble;
