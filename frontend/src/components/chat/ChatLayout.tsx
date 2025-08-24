import { Link } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import MessagingWindow from "./MessagingWindow";

const ChatLayout = () => {
  const authenticated = true;

  if (!authenticated) {
    return (
      <div>
        <span>
          Not authenticated, go to <Link to={"/login"}>login</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-72">
        <ChatSidebar />
      </div>

      <div className="flex-1">
        <MessagingWindow />
      </div>
    </div>
  );
};

export default ChatLayout;
