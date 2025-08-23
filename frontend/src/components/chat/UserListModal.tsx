import {
  ChatCreateRequestChatTypeEnum,
  type ChatCreateRequest,
  type ChatListResponse,
  type UserResponse,
} from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // assuming you have a UI input
import { useAuth } from "@/context/chat/test/AuthContext";
import apiChat from "@/services/chat/apiChat";
import { apiUser } from "@/services/chat/test/apiAuth";
import { useState, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useChat } from "@/context/chat/ChatContext";

interface UserListModalProps {
  onClose: () => void;
}

const UserListModal: FunctionComponent<UserListModalProps> = ({ onClose }) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser, token } = useAuth();
  const { setConversations } = useChat();

  const navigate = useNavigate();

  const handleSearch = async (e?: React.FormEvent, nextPage?: number) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await apiUser.searchUsers(
        query,
        {
          page: nextPage ?? 0,
          size: 10,
        },
        token
      );

      const currentPage = response.page ?? 0;
      const totalPages = response.totalPages ?? 0;
      const fetchedUsers = response.data ?? [];

      setHasMore(currentPage + 1 < totalPages);
      setPage(currentPage);

      if (nextPage && nextPage > 0) {
        setUsers((prev) => [...prev, ...fetchedUsers]);
      } else {
        setUsers(fetchedUsers);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartPrivateChat = async (userId: string) => {
    const chatCreateRequest: ChatCreateRequest = {
      chatType: ChatCreateRequestChatTypeEnum.Private,
      memberIds: [userId],
    };
    const response = await apiChat.createChat(chatCreateRequest);
    const data = response.data;

    if (!response.success) {
      throw Error(response.message ?? "Error while creating chat");
    }
    if (data && data.chatId) {
      const newConversation: ChatListResponse = {
        ...data,
        lastMessage: "",
        lastMessageSenderUsername: "",
        lastMessageSentAt: "",
        unreadMessagesCount: 0,
        muted: false,
      };
      setConversations((prev) => [newConversation, ...prev]);
      navigate(`/chat/${data.chatId}`);
      onClose();
    } else {
      throw Error("Chat ID is missing in the response.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Search for a user</DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter username or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {/* Results */}
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {users.length === 0 && !loading && (
            <p className="text-sm text-gray-500">No users found</p>
          )}
          {users
            .filter((user) => user.id !== currentUser?.id)
            .map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="justify-start"
                onClick={() => user.id && handleStartPrivateChat(user.id)}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={user.profileImagePath}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2>{user.username}</h2>
                </div>
              </Button>
            ))}

          {hasMore && (
            <Button
              variant="outline"
              onClick={() => handleSearch(undefined, page + 1)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      </DialogContent>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </Dialog>
  );
};

export default UserListModal;
