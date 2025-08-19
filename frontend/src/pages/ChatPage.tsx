import MessageWindow from "@/components/chat/MessageWindow";
import type { FunctionComponent } from "react";

interface ChatPageProps {}

const ChatPage: FunctionComponent<ChatPageProps> = () => {
  return (
    <MessageWindow />
  );
};

export default ChatPage;
