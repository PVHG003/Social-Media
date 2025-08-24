import { Outlet } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";

const ChatLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-72">
        <ChatSidebar />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
