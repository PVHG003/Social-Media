import { ChatListResponseChatTypeEnum, type ChatListResponse } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import formatRelativeTime from "@/utils/relativeSentTime";

const chatSampleData: ChatListResponse[] = [
  {
    chatId: "1",
    chatDisplayName: "Alice Johnson",
    chatDisplayImage: "https://randomuser.me/api/portraits/women/68.jpg",
    chatType: ChatListResponseChatTypeEnum.Private,
    lastMessage: "Hey, how are you?",
    lastMessageSenderUsername: "Alice",
    lastMessageSentAt: "2025-08-24T09:15:30",
    unreadMessagesCount: 2,
    muted: false,
    createdAt: "2025-08-23T14:22:10",
  },
  {
    chatId: "2",
    chatDisplayName: "Bob Smith",
    chatDisplayImage: "https://randomuser.me/api/portraits/men/75.jpg",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Meeting at 3 PM?",
    lastMessageSenderUsername: "Charlie",
    lastMessageSentAt: "2025-08-24T10:45:00",
    unreadMessagesCount: 5,
    muted: true,
    createdAt: "2025-08-20T18:30:00",
  },
  {
    chatId: "3",
    chatDisplayName: "Charlie Nguyen",
    chatDisplayImage: "https://randomuser.me/api/portraits/men/32.jpg",
    chatType: ChatListResponseChatTypeEnum.Private,
    lastMessage: "See you tomorrow!",
    lastMessageSenderUsername: "Charlie",
    lastMessageSentAt: "2025-08-24T11:05:45",
    unreadMessagesCount: 0,
    muted: false,
    createdAt: "2025-08-21T09:00:00",
  },
  {
    chatId: "4",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
  {
    chatId: "5",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
  {
    chatId: "6",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
  {
    chatId: "7",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
  {
    chatId: "8",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
  {
    chatId: "9",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
  {
    chatId: "10",
    chatDisplayName: "Team Project",
    chatDisplayImage:
      "https://images.unsplash.com/photo-1502767089025-6572583495b0?w=400&h=400&fit=crop",
    chatType: ChatListResponseChatTypeEnum.Group,
    lastMessage: "Don't forget to push your code.",
    lastMessageSenderUsername: "Dave",
    lastMessageSentAt: "2025-08-24T12:00:00",
    unreadMessagesCount: 10,
    muted: false,
    createdAt: "2025-08-15T08:45:30",
  },
];

const ChatList = () => {
  return (
    <ScrollArea className="overflow-y-auto">
      {chatSampleData &&
        chatSampleData.map((chat) => (
          <div
            key={chat.chatId}
            className="flex gap-4 p-4 shadow-sm hover:bg-gray-300 cursor-pointer items-center"
          >
            {/* Avatar */}
            <Avatar>
              <AvatarImage src={chat.chatDisplayImage} />
              <AvatarFallback>{chat.chatDisplayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            {/* Chat Content */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Top row */}
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-sm truncate max-w-[70%]">
                  {chat.chatDisplayName}
                </h2>
                <p className="text-xs text-gray-400 shrink-0">
                  {formatRelativeTime(chat.lastMessageSentAt ?? "")}
                </p>
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 truncate max-w-[70%]">
                  {chat.lastMessageSenderUsername}:{" "}
                  {chat.lastMessage && chat.lastMessage.length > 20
                    ? chat.lastMessage.substring(0, 20) + "..."
                    : chat.lastMessage}
                </span>

                {chat.unreadMessagesCount && chat.unreadMessagesCount > 0 ? (
                  <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full shrink-0">
                    {chat.unreadMessagesCount}
                  </span>
                ) : null}
              </div>
            </div>{" "}
          </div>
        ))}
    </ScrollArea>
  );
};

export default ChatList;
