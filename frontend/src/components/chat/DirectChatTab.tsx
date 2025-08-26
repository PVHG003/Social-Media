import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { UserResponse } from "@/api";

interface DirectChatTabProps {
  users: UserResponse[];
  onSearch: (query: string, page?: number) => void;
  onCreate: (userId: string) => void;
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const DirectChatTab: React.FC<DirectChatTabProps> = ({
 users,
 onSearch,
 onCreate,
 page,
 hasMore,
 loading,
 error,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onSearch(q, 0); // reset to first page
  };

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={handleSearch}
        placeholder="Search for a user..."
      />

      {/* Error state */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* User list */}
      <div className="border rounded p-2 max-h-40 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-gray-500">Loading users...</p>
        ) : users.length > 0 ? (
          users.map((u) => (
            <div
              key={u.id}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => onCreate(u.id ?? "")}
            >
              {u.username}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No users found</p>
        )}
      </div>

      {/* Load More button */}
      {hasMore && !loading && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSearch(query, page + 1)}
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default DirectChatTab;
