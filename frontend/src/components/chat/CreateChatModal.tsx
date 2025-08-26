import {type UserResponse} from "@/api";
import chatApi from "@/services/chat/apiChat";
import userApi from "@/services/user/apiUser";
import React, {useCallback, useEffect, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "../ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import DirectChatTab from "./DirectChatTab";
import GroupChatTab from "./GroupChatTab";

interface CreateChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({open, onOpenChange}) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateOneToOne = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        await chatApi.createChat({
          chatType: "PRIVATE",
          memberIds: [userId],
        });
        console.log("Created 1-1 chat with:", userId);
        onOpenChange(false);
      } catch (err) {
        console.error("Error creating 1-1 chat:", err);
        setError("Failed to create direct chat.");
      } finally {
        setLoading(false);
      }
    },
    [onOpenChange]
  );

  const handleCreateGroup = useCallback(
    async (groupName: string, userIds: string[]) => {
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
      } catch (err) {
        console.error("Error creating group chat:", err);
        setError("Failed to create group chat.");
      } finally {
        setLoading(false);
      }
    },
    [onOpenChange]
  );

  const handleUserSearch = useCallback(
    async (query: string, nextPage = 0) => {
      console.log("Searching users for:", query, "page:", nextPage);
      setLoading(true);
      setError(null);
      try {
        const response = await userApi.searchUsers(query, {
          page: nextPage,
          size: pageSize,
        });

        if (nextPage > 0) {
          setUsers((prev) => [...prev, ...(response.data ?? [])]);
        } else {
          setUsers(response.data ?? []);
        }

        setPage(response.page ?? 0);
        setHasMore((response.page ?? 0) < (response.totalPages ?? 0));
      } catch (err) {
        console.error("Error searching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    if (open) {
      handleUserSearch("", 0).then(r => console.log(r));
    } else {
      setUsers([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      setLoading(false);
    }
  }, [open, handleUserSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Choose between starting a direct chat or creating a group.
          </DialogDescription>
        </DialogHeader>

        {/* show loading/error states globally */}
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}

        <Tabs defaultValue="direct" className="w-full mt-2">
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
              loading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="group">
            <GroupChatTab
              users={users}
              onSearch={handleUserSearch}
              onCreate={handleCreateGroup}
              hasMore={hasMore}
              page={page}
              loading={loading}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatModal;
