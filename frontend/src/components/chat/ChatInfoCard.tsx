import type { ChatListResponse } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ChatInfoCardProps {
  chat: ChatListResponse;
}

const BASE_URL = "http://localhost:8080/";

const ChatInfoCard = ({ chat }: ChatInfoCardProps) => {
  const timeLabel = chat.lastMessageSentAt
    ? formatDistanceToNow(new Date(chat.lastMessageSentAt), { addSuffix: true })
    : "";

  const getProfileImage = () => {
    if (!chat.chatDisplayImage) return "";
    return chat.chatDisplayImage?.startsWith("https://")
      ? chat.chatDisplayImage
      : `${BASE_URL}${chat.chatDisplayImage}`;
  };

  // Limit chat name length
  const displayName =
    chat.chatDisplayName && chat.chatDisplayName.length > 20
      ? chat.chatDisplayName.slice(0, 20) + "…"
      : chat.chatDisplayName;

  // Limit last message length
  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const displayMessage = chat.lastMessage
    ? truncate(chat.lastMessage, 20)
    : "No messages yet";

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors">
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        <AvatarImage src={getProfileImage()} alt={chat.chatDisplayName} />
        <AvatarFallback>
          {chat.chatDisplayName?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{displayName}</p>
          {timeLabel && (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {timeLabel}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground truncate">
          {chat.lastMessageSenderUsername
            ? `${chat.lastMessageSenderUsername}: `
            : ""}
          {displayMessage}
        </p>
      </div>

      {/* Unread badge */}
      {chat.unreadMessagesCount ? (
        <span className="ml-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full px-2 py-0.5">
          {chat.unreadMessagesCount > 99 ? "99+" : chat.unreadMessagesCount}
        </span>
      ) : null}
    </div>
  );
};

export default ChatInfoCard;
