import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiUser from "@/services/user/apiUser.ts";
import type { ChatCreateRequest, UserResponse } from "@/api";
import { useAuth } from "@/context/authentication/AuthContext.tsx";
import { useChat } from "@/hooks/chat/useChat";
import chatApi from "@/services/chat/apiChat.ts";

const BASE_URL = "http://localhost:8080/";

interface ChatSearchModalProps {
  open: boolean;
  onClose: () => void;
  mode: "private" | "group";
  onAddMembers?: (userIds: string[]) => Promise<void>; // new
}

const ChatSearchModal = ({
  open,
  onClose,
  mode,
  onAddMembers,
}: ChatSearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResponse[]>([]);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>(
    []
  );

  const { user } = useAuth();
  const { chats, addChat } = useChat();
  
  const getProfileImageUrl = (profileImagePath?: string) => {
    if (!profileImagePath) return undefined;
    return profileImagePath.startsWith("http") ? profileImagePath : `${BASE_URL}${profileImagePath}`;
  };

  const handleSearch = async () => {
    if (query === "") return;
    const response = await apiUser.searchUsers(query);
    const foundUsers = response.data ?? [];
    console.log("[handleSearch] foundUsers", foundUsers);

    const filtered = foundUsers.filter((resultData) => {
      if (resultData.id === user?.id) return false;

      const hasPrivateChat = chats.some(
        (chat) =>
          chat.chatType === "PRIVATE" &&
          chat.memberIds?.some((id) => {
            console.log(id, resultData.id);
            return id === resultData.id;
          })
      );

      return !hasPrivateChat;
    });

    setResults(filtered);
  };

  const handleCreatePrivateChat = async (userId: string) => {
    const request: ChatCreateRequest = {
      memberIds: [userId],
      chatType: "PRIVATE",
    };
    const { data } = await chatApi.chat.create(request);
    addChat(data);
  };

  const handleCreateGroupChat = async () => {
    const request: ChatCreateRequest = {
      groupName: "New Group",
      memberIds: selectedGroupMembers,
      chatType: "GROUP",
    };
    const { data } = await chatApi.chat.create(request);
    addChat(data);
    setSelectedGroupMembers([]);
    setQuery("");
    setResults([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "private" ? "Start Private Chat" : "Create Group Chat"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search users..."
            value={query}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <ScrollArea>
          <div className="max-h-64 overflow-y-auto border rounded p-2">
            {results.length > 0 ? (
              results.map((r) =>
                mode === "private" ? (
                  // ✅ PRIVATE MODE
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer"
                    onClick={async () => {
                      console.log("Selected private:", r);
                      setQuery("");
                      setResults([]);
                      await handleCreatePrivateChat(r.id!);
                      onClose();
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      {r.profileImagePath ? (
                        <AvatarImage 
                          src={getProfileImageUrl(r.profileImagePath)} 
                          alt={r.username || 'User'}
                        />
                      ) : (
                        <AvatarFallback>
                          {r.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{r.username}</span>
                  </div>
                ) : (
                  // ✅ GROUP MODE
                  <label
                    key={r.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={r.id}
                      checked={selectedGroupMembers.includes(r.id as string)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGroupMembers((prev) =>
                            r.id ? [...prev, r.id] : [...prev]
                          );
                        } else {
                          setSelectedGroupMembers((prev) =>
                            prev.filter((id) => id !== r.id)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <Avatar className="h-8 w-8">
                      {r.profileImagePath ? (
                        <AvatarImage 
                          src={getProfileImageUrl(r.profileImagePath)} 
                          alt={r.username || 'User'}
                        />
                      ) : (
                        <AvatarFallback>
                          {r.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>{r.username}</span>
                  </label>
                )
              )
            ) : (
              <p className="text-sm text-muted-foreground">No results</p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          {mode === "group" && (
            <>
              {onAddMembers ? (
                // 🔄 Add Members mode
                <Button
                  onClick={async () => {
                    await onAddMembers(selectedGroupMembers);
                    setSelectedGroupMembers([]);
                    setQuery("");
                    setResults([]);
                    onClose();
                  }}
                  disabled={selectedGroupMembers.length === 0}
                >
                  Add Members
                </Button>
              ) : (
                // 🆕 Create Group mode
                <Button
                  onClick={handleCreateGroupChat}
                  disabled={selectedGroupMembers.length === 0}
                >
                  Create Group
                </Button>
              )}
            </>
          )}

          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSearchModal;
