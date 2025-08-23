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

  fetchChatMessages: (page?: number, append?: boolean) => Promise<void>;

  chatPage: number;

  hasMoreMessages: boolean;
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
  const [chatPage, setChatPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const pageable: Pageable = { page: 0, size: 10, sort: [] };
      const response = await apiChat.getChatList(pageable);
      console.log("[ChatProvider] Conversations fetched:", response.data);
      setConversations(response.data?.reverse() ?? []);
    };
    fetchConversations();
  }, []);

  const fetchChatMessages = async (page = 0, append = false) => {
    if (!currentChatId) return;
    const response = await apiChat.getChatMessages(currentChatId, {
      page,
      size: 20,
      sort: [],
    });
    console.log(
      `[ChatProvider] Messages fetched for chatId=${currentChatId}:`,
      response.data
    );
    const messages = response.data?.reverse() ?? [];
    setChatMessages((prev) => (append ? [...messages, ...prev] : messages));

    setHasMoreMessages(messages.length === 20); // if less than page size, no more
    setChatPage(page);
  };

  useEffect(() => {
    if (!currentChatId) return;
    fetchChatMessages(0, false);
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

    fetchChatMessages,

    chatPage,

    hasMoreMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used inside ChatProvider");
  return context;
};
