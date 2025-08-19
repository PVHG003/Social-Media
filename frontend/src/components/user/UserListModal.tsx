import {
  ChatCreateRequestChatTypeEnum,
  type ChatCreateRequest,
  type UserDto,
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
import chatApi from "@/services/chatApi";
import userApi from "@/services/userApi";
import { useEffect, useState, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/authContext";

interface UserListModalProps {
  onClose: () => void;
}

const UserListModal: FunctionComponent<UserListModalProps> = ({ onClose }) => {
  // Fake data for now — replace with API call later
  const [users, setUsers] = useState<UserDto[]>([]);

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await userApi.getAllUser();
      setUsers(response.data ?? []);
    };
    fetchUsers();
  }, []);

  const handleStartPrivateChat = async (userId: string) => {
    const chatCreateRequest: ChatCreateRequest = {
      chatType: ChatCreateRequestChatTypeEnum.Private,
      memberIds: [userId],
    };
    const response = await chatApi.createChat(chatCreateRequest);
    if (!response.success) {
      throw Error(response.message ?? "Error while creating chat");
    }
    if (response.data && response.data.chatId) {
      navigate(`/chat/${response.data.chatId}`);
      onClose();
    } else {
      throw Error("Chat ID is missing in the response.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Select a user</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
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
                    <AvatarImage src={user.profileImage} alt={user.username} />
                    <AvatarFallback>
                      {user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2>{user.username}</h2>
                </div>
              </Button>
            ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserListModal;
