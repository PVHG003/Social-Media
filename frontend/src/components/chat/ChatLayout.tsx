import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/context/chat/ChatContext"; // assume we have conversations here
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const ChatLayout = () => {
  const { conversations, currentChatId, setCurrentChatId, chatDetail } =
    useChat();

  const navigate = useNavigate();

  //   const { openUserList } = useUserModal();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b font-semibold text-lg">
          <span>Conversations</span>
          <Button
            className="w-8 h-8 p-0"
            // onClick={openUserList}
            aria-label="Start new conversation"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {conversations
              ?.slice()
              .sort((a, b) => {
                if (a.lastMessageSentAt && b.lastMessageSentAt) {
                  return (
                    new Date(b.lastMessageSentAt).getTime() -
                    new Date(a.lastMessageSentAt).getTime()
                  );
                }
                return 0;
              })
              .map((chat) => (
                <button
                  key={chat.chatId}
                  onClick={() => {
                    if (chat.chatId) {
                      setCurrentChatId(chat.chatId);
                      navigate(`/chat/${chat.chatId}`);
                    }
                  }}
                  className={cn(
                    "flex items-center px-4 py-3 text-left hover:bg-muted/50 transition",
                    chat.chatId === currentChatId ? "bg-muted" : ""
                  )}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={chat.chatDisplayImage}
                      alt={chat.chatDisplayName}
                    />
                    <AvatarFallback>
                      {chat.chatDisplayName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">
                        {chat.chatDisplayName}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {chat.lastMessageSentAt
                          ? format(new Date(chat.lastMessageSentAt), "p")
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage || chat.lastMessageSenderUsername
                        ? `${chat.lastMessageSenderUsername ?? "Unknown"}: ${
                            chat.lastMessage
                              ? chat.lastMessage.length > 20
                                ? chat.lastMessage.slice(0, 20) + "..."
                                : chat.lastMessage
                              : ""
                          }`
                        : "No messages yet"}
                    </p>{" "}
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header (shows info about the current chat if one is selected) */}
        <div className="border-b px-4 py-3">
          {currentChatId && chatDetail ? (
            <div className="flex">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage
                  src={chatDetail.chatDisplayImage}
                  alt={chatDetail.chatDisplayName}
                />
                <AvatarFallback>
                  {chatDetail.chatDisplayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h2 className="text-lg font-semibold ">
                {chatDetail.chatDisplayName}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-semibold">No chat selected</h2>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentChatId ? (
            <Outlet /> // ChatPage will render here
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Select a conversation to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
