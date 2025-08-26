import { type UserResponse } from "@/api";
import chatApi from "@/services/chat/apiChat";
import userApi from "@/services/user/apiUser";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DirectChatTab from "./DirectChatTab";
import GroupChatTab from "./GroupChatTab";

interface CreateChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateOneToOne = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await chatApi.createChat({
        chatType: "PRIVATE",
        memberIds: [userId],
      });
      console.log("Created 1-1 chat with:", userId);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating 1-1 chat:", error);
      setError("Failed to create chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupName: string, userIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await chatApi.createChat({
        chatType: "GROUP",
        memberIds: userIds,
        groupName,
      });
      console.log("Created group chat:", groupName, "with:", userIds);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating group chat:", error);
      setError("Failed to create chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async (query: string, nextPage = 0) => {
    setLoading(true);
    setError(null);
    console.log("Searching users for:", query, "page:", nextPage);
    try {
      const response = await userApi.searchUsers(query, {
        page: nextPage,
        size: pageSize,
      });

      // append if loading more, otherwise replace
      if (nextPage > 0) {
        setUsers((prev) => [...prev, ...(response.data ?? [])]);
      } else {
        setUsers(response.data ?? []);
      }

      setPage(response.page ?? 0);
      setPageSize(response.pageSize ?? 20);
      setHasMore(response.page < (response.totalPages ?? 0));
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to create chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Choose between starting a direct chat or creating a group.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
          </TabsList>

          <TabsContent value="direct">
            <DirectChatTab
              users={users}
              onSearch={handleUserSearch}
              onCreate={handleCreateOneToOne}
              hasMore={hasMore}
              page={page}
            />
          </TabsContent>

          <TabsContent value="group">
            <GroupChatTab
              users={users}
              onSearch={handleUserSearch}
              onCreate={handleCreateGroup}
              hasMore={hasMore}
              page={page}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatModal;
