import type { ChatDetailResponse, ChatUpdateRequest } from "@/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/chat/useChat";
import apiAttachment from "@/services/chat/apiAttachment";
import chatApi from "@/services/chat/apiChat.ts";
import { MinusCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatDetailModalProps {
  open: boolean;
  onClose: () => void;
  chat: ChatDetailResponse | null;
}

const BASE_URL = "http://localhost:8080/";

const ChatDetailModal = ({ open, onClose, chat }: ChatDetailModalProps) => {
  const { selectedChatId, fetchChatDetail } = useChat();
  const [name, setName] = useState(chat?.chatDisplayName ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(chat?.chatDisplayName ?? "");
    setAvatarFile(null);
    setPreviewUrl(null);
  }, [chat]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!chat?.chatId) return;
    setIsSaving(true);

    try {
      const request: ChatUpdateRequest = { groupName: name };
      await chatApi.chat.update(chat.chatId, request);

      if (avatarFile) {
        await apiAttachment.groupImage(selectedChatId!, avatarFile);
      }

      await fetchChatDetail(chat.chatId);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!chat) return null;

  const handleRemoveMember = async (id: string | undefined): Promise<void> => {
    if (!id) return;
    await chatApi.members.remove(chat.chatId!, id);
    await fetchChatDetail(chat.chatId!);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chat Details</DialogTitle>
        </DialogHeader>

        {/* Avatar with preview */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                previewUrl ||
                (chat.chatDisplayImage
                  ? `${BASE_URL}${chat.chatDisplayImage}`
                  : "")
              }
            />
            <AvatarFallback>
              {chat.chatDisplayName?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
          <Input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Group Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Members */}
        <div>
          <p className="text-sm font-medium mb-2">Members</p>
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
            {chat.members?.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={m.profileImage ? `${BASE_URL}${m.profileImage}` : ""}
                  />
                  <AvatarFallback>
                    {m.username?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{m.username}</span>
                <Button
                  variant="outline"
                  onClick={() => handleRemoveMember(m.id)}
                >
                  <MinusCircle />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDetailModal;
