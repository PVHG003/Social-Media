import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  ChatDetailResponse,
  ChatListResponse,
  ChatMessageResponse,
} from "@/api";
import chatApi from "@/services/chat/apiChat";

interface ChatContextType {
  currentChatId: string | null;
  setCurrentChatId: (chatId: string | null) => void;
  chats: ChatListResponse[];
  chatInfo: ChatDetailResponse | null;
  messages: ChatMessageResponse[];
  loadingChats: boolean;
  loadingChatInfo: boolean;
  loadingMessages: boolean;
  errorChats: string | null;
  errorChatInfo: string | null;
  errorMessages: string | null;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  fetchChatInfo: (chatId: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatListResponse[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatDetailResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChatInfo, setLoadingChatInfo] = useState(false);
  const [errorChats, setErrorChats] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [errorChatInfo, setErrorChatInfo] = useState<string | null>(null);

  const fetchChats = async () => {
    setLoadingChats(true);
    setErrorChats(null);
    try {
      const { data } = await chatApi.getChatList({ page: 0, size: 50 });
      setChats(data || []);
      console.log("[ChatProvider] Fetched chats:", data);
    } catch (err: any) {
      setErrorChats(err.message || "Failed to fetch chats");
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    setLoadingMessages(true);
    setErrorMessages(null);
    try {
      const { data } = await chatApi.getChatMessages(chatId, {
        page: 0,
        size: 50,
      });
      setMessages(data?.reverse() || []);
      console.log("[ChatProvider] Fetched messages:", data);
    } catch (err: any) {
      setErrorMessages(err.message || "Failed to fetch messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchChatInfo = async (chatId: string) => {
    setLoadingChatInfo(true);
    setErrorChatInfo(null);
    try {
      const { data } = await chatApi.getChatInfo(chatId);
      setChatInfo(data || null);
      console.log("[ChatProvider] Fetched chat info:", data);
    } catch (err: any) {
      setErrorChatInfo(err.message || "Failed to fetch chat info");
    } finally {
      setLoadingChatInfo(false);
    }
  };

  // Fetch chat list on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages whenever currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (currentChatId) {
      fetchChatInfo(currentChatId);
    } else {
      setChatInfo(null);
    }
  }, [currentChatId]);

  return (
    <ChatContext.Provider
      value={{
        currentChatId,
        setCurrentChatId,
        chats,
        messages,
        chatInfo,
        loadingChats,
        loadingMessages,
        loadingChatInfo,
        errorChats,
        errorMessages,
        errorChatInfo,
        fetchChats,
        fetchMessages,
        fetchChatInfo,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
