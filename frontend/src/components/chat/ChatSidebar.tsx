import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChevronDown, CogIcon, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import ChatList from "./ChatList";
import { useState } from "react";
import { Separator } from "../ui/separator";

const ChatSidebar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SidebarProvider>
      {/* Mobile trigger (shows only on small screens) */}
      <div className="p-2 sm:hidden">
        <SidebarTrigger />
      </div>

      <Sidebar className="w-72">
        {/* Header */}
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* App Icon */}
            <div className="flex items-center gap-2">
              <CogIcon className="h-8 w-8 text-gray-600" />
              <h2 className="text-lg font-semibold">Chat</h2>
            </div>

            {/* Create Chat Button */}
            <Button
              variant="ghost"
              className="hover:bg-gray-200 rounded-full"
              size="icon"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>

        <Separator />

        {/* Chat List */}
        <SidebarContent>
          <ChatList />
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-3 border-t">
          <div className="flex items-center justify-between">
            {/* Avatar + Username */}
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  className="rounded-full"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium">Alice Johnson</span>
            </div>

            {/* Chevron Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setModalOpen(!modalOpen)}
              className="transition-transform duration-300"
            >
              <ChevronDown
                className={`h-4 w-4 transform transition-transform duration-300 ${
                  modalOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default ChatSidebar;
