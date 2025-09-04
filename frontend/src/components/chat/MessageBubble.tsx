import type { ChatMessageResponse } from "@/api";
import MessageAttachments from "@/components/chat/MessageAttachments.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useAuth } from "@/context/authentication/AuthContext.tsx";
import { formatDistanceToNow } from "date-fns";

interface MessageBubbleProps {
  message: ChatMessageResponse;
}

const urlRegex = /(https?:\/\/[^\s]+)/;
const BASE_URL = "http://localhost:8080/";

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useAuth();
  const isMe = user?.id === message.senderId;

  const getProfileImage = () => {
    return message.senderProfileImage &&
    message.senderProfileImage?.startsWith("https://")
      ? message.senderProfileImage
      : `${BASE_URL}${message.senderProfileImage}`;
  };

  const getYouTubeId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex); 
    return match ? match[1] : null;
  };

  const timeLabel = message.sentAt
    ? formatDistanceToNow(new Date(message.sentAt), { addSuffix: true })
    : "";

  const isImageUrl = (url: string) => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };

  return (
    <div className={`flex flex-col mb-2 ${isMe ? "items-end" : "items-start"}`}>
      <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
        {/* Avatar for other users */}
        {!isMe && (
          <Avatar className="h-10 w-10">
            {message.senderProfileImage ? (
              <AvatarImage
                src={getProfileImage()}
                alt={message.senderUsername ?? "?"}
              />
            ) : (
              <AvatarFallback>
                {message.senderUsername?.charAt(0) ?? "?"}
              </AvatarFallback>
            )}
          </Avatar>
        )}

        {/* Message content + attachments */}
        <Card
          className={`p-3 flex flex-col gap-1 break-words 
            ${
              isMe
                ? "bg-sky-100 text-sky-900 ml-auto"
                : "bg-gray-100 text-gray-900 mr-auto"
            } 
            max-w-[400px]`}
        >
          {/* Sender name for other users */}
          {!isMe && message.senderUsername && (
            <span className="text-xs font-semibold">
              {message.senderUsername}
            </span>
          )}

          {/* Message text */}
          {message.content &&
            message.content.split(/\s+/).map((word, i) => {
              const videoId = getYouTubeId(word);

              // YouTube → embed player
              if (videoId) {
                return (
                  <div key={i} className="my-2 items-center justify-center">
                    <iframe
                      width="300"
                      height="170"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    />
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs mt-1 text-blue-600 underline truncate max-w-[300px]"
                    >
                      youtube.com/watch?v={videoId}
                    </a>
                  </div>
                );
              }

              // Image URLs → inline image preview
              if (urlRegex.test(word) && isImageUrl(word)) {
                return (
                  <div key={i} className="my-2">
                    <a href={word} target="_blank" rel="noopener noreferrer">
                      <img
                        src={word}
                        alt="preview"
                        className="max-w-[300px] rounded border"
                      />
                    </a>
                  </div>
                );
              }

              // Generic URL → static card with favicon + link
              if (urlRegex.test(word)) {
                const url = new URL(word);
                const favicon = `${url.origin}/favicon.ico`;

                return (
                  <div key={i} className="my-2">
                    <a
                      href={word}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded overflow-hidden hover:opacity-90 bg-white"
                    >
                      <div className="flex items-center p-2">
                        <img
                          src={favicon}
                          alt="favicon"
                          className="w-5 h-5 mr-2"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                        />
                        <span className="text-xs truncate max-w-[250px]">
                          {word}
                        </span>
                      </div>
                    </a>
                  </div>
                );
              }

              // Normal text
              return <span key={i}>{word} </span>;
            })}

          <MessageAttachments attachments={message.attachments} />
        </Card>
      </div>

      {/* Timestamp outside card */}
      {message.sentAt && (
        <span className="text-[10px] text-muted-foreground mt-1 px-2">
          {timeLabel}
        </span>
      )}
    </div>
  );
};

export default MessageBubble;
