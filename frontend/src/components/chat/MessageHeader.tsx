import { useChat } from "@/context/chat/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const BASE_AVATAR_URL = "http://localhost:8080/";

const MessageHeader = () => {
  const { chatInfo } = useChat();

  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={`${BASE_AVATAR_URL}${chatInfo?.chatDisplayImage}`} />
        <AvatarFallback>{chatInfo?.chatDisplayName?.charAt(0)}</AvatarFallback>
      </Avatar>

      <h2>{chatInfo?.chatDisplayName}</h2>
    </div>
  );
};

export default MessageHeader;
