import type {
  ChatDetailResponse,
  ChatListResponse,
  ChatMessageResponse,
  Pageable,
} from "@/api";
import apiChat from "@/services/chat/apiChat";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "react-router-dom";

interface ChatContextInterface {
  currentChatId: string;
  setCurrentChatId: (id: string) => void;

  conversations: ChatListResponse[];
  setConversations: React.Dispatch<React.SetStateAction<ChatListResponse[]>>;

  chatMessages: ChatMessageResponse[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageResponse[]>>;

  chatDetail: ChatDetailResponse | undefined;
  addConversation: (chat: ChatListResponse) => void;
}

export const ChatContext = createContext<ChatContextInterface | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { chatId } = useParams<{ chatId: string }>();

  const [currentChatId, setCurrentChatId] = useState<string>(chatId ?? "");
  const [conversations, setConversations] = useState<ChatListResponse[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessageResponse[]>([]);
  const [chatDetail, setChatDetail] = useState<ChatDetailResponse | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchConversations = async () => {
      const pageable: Pageable = { page: 0, size: 10, sort: [] };
      const response = await apiChat.getChatList(pageable);
      console.log("[ChatProvider] Conversations fetched:", response.data);
      setConversations(response.data?.reverse() ?? []);
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!currentChatId) return;
    const fetchChatMessages = async () => {
      const pageable: Pageable = { page: 0, size: 10, sort: [] };
      const response = await apiChat.getChatMessages(currentChatId, pageable);
      console.log(
        `[ChatProvider] Messages fetched for chatId=${currentChatId}:`,
        response.data
      );
      setChatMessages(response.data?.reverse() ?? []);
    };
    fetchChatMessages();
  }, [currentChatId]);

  useEffect(() => {
    if (!currentChatId) return;
    const fetchChatDetail = async () => {
      const response = await apiChat.getChatInfo(currentChatId);
      console.log(
        `[ChatProvider] Chat detail fetched for chatId=${currentChatId}:`,
        response.data
      );
      setChatDetail(response.data);
    };
    fetchChatDetail();
  }, [currentChatId]);

  useEffect(() => {
    console.log("[ChatProvider] State updated:", {
      currentChatId,
      conversations,
      chatMessages,
      chatDetail,
    });
  }, [currentChatId, conversations, chatMessages, chatDetail]);

  const addConversation = (chat: ChatListResponse) => {
    setConversations((prev) => [chat, ...prev]);
  };

  const value: ChatContextInterface = {
    currentChatId,
    setCurrentChatId,

    conversations,
    setConversations,

    chatMessages,
    setChatMessages,

    chatDetail,

    addConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
};