import { useState } from "react";
import type { AddMembersRequest, ChatDetailResponse } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import ChatSearchModal from "../chat/ChatSearchModal";
import { useChat } from "@/hooks/chat/useChat";
import chatApi from "@/services/chat/apiChat.ts";

interface MessagingHeaderProps {
  chat: ChatDetailResponse | null;
  onClick: () => void; // this opens ChatDetailModal
}

const BASE_URL = "http://localhost:8080/";

const MessagingHeader = ({ chat, onClick }: MessagingHeaderProps) => {
  const [openModal, setOpenModal] = useState(false);
  const { fetchChatDetail } = useChat();

  const getProfileImageUrl = (profileImagePath?: string) => {
    if (!profileImagePath) return undefined;
    return profileImagePath.startsWith("http")
      ? profileImagePath
      : `${BASE_URL}${profileImagePath}`;
  };

  const handleAddMember = async (userIds: string[]) => {
    if (!chat?.chatId) return;
    const request: AddMembersRequest = { userIds };
    await chatApi.members.add(chat.chatId, request);
    await fetchChatDetail(chat.chatId);
  };

  return (
    <div className="flex items-center gap-3 justify-between">
      {/* Left side: Avatar + info → clickable */}
      <div
        className="flex items-center gap-3 cursor-pointer hover:opacity-80"
        onClick={onClick}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={getProfileImageUrl(chat?.chatDisplayImage)} />
          <AvatarFallback>
            {chat?.chatDisplayName?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <p className="font-medium text-sm">
            {chat?.chatDisplayName ?? "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Right side: Add Members button */}
      {chat?.chatType === "GROUP" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenModal(true)}
          >
            Add Members
          </Button>

          <ChatSearchModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            mode="group"
            onAddMembers={handleAddMember}
          />
        </>
      )}
    </div>
  );
};

export default MessagingHeader;
