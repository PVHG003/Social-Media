import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { UserResponse } from "@/api";

interface GroupChatTabProps {
  users: UserResponse[];
  onSearch: (query: string, page?: number) => void;
  onCreate: (groupName: string, userIds: string[]) => void;
  page: number;
  hasMore: boolean;
}

const GroupChatTab: React.FC<GroupChatTabProps> = ({
  users,
  onSearch,
  onCreate,
  page,
  hasMore,
}) => {
  const [query, setQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onSearch(q, 0); // reset to first page
  };

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-3">
      <Input
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group name"
      />

      <Input
        value={query}
        onChange={handleSearch}
        placeholder="Search for users..."
      />

      <div className="border rounded p-2 max-h-40 overflow-y-auto">
        {users.length > 0 ? (
          users.map((u) => (
            <label
              key={u.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(u.id ?? "")}
                onChange={() => toggleUser(u.id ?? "")}
              />
              {u.username}
            </label>
          ))
        ) : (
          <p className="text-sm text-gray-500">No users found</p>
        )}
      </div>

      {hasMore && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSearch(query, page + 1)}
        >
          Load More
        </Button>
      )}

      <Button
        className="w-full"
        onClick={() => onCreate(groupName, selectedUsers)}
        disabled={!groupName || selectedUsers.length === 0}
      >
        Create Group
      </Button>
    </div>
  );
};

export default GroupChatTab;
