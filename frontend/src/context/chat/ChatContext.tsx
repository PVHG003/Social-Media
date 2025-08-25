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
  addMessage: (message: ChatMessageResponse) => void;
  addChat: (payloadData: ChatMessageResponse) => void;
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

      const sortedData = data?.sort((a, b) => {
        return (
          new Date(b.lastMessageSentAt ?? 0).getTime() -
          new Date(a.lastMessageSentAt ?? 0).getTime()
        );
      });

      setChats(sortedData || []);
      console.log("[ChatProvider] Fetched chats:", sortedData);
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

      // 🔥 Replace "\n" with actual new lines
      const cleanedMessages = (data || []).map((msg: any) => ({
        ...msg,
        content: msg.content ? msg.content.replace(/\\n/g, "\n") : "",
      }));

      setMessages(cleanedMessages.reverse());
      console.log("[ChatProvider] Fetched messages:", cleanedMessages);
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

  const addMessage = (message: ChatMessageResponse) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const addChat = async (payloadData: ChatMessageResponse) => {
    if (currentChatId) {
      try {
        const { data: chatDetail } = await chatApi.getChatInfo(currentChatId);

        if (!chatDetail) return;

        const chat: ChatListResponse = {
          chatId: chatDetail.chatId,
          chatDisplayName: chatDetail.chatDisplayName,
          chatDisplayImage: chatDetail.chatDisplayImage,
          chatType: chatDetail.chatType,
          createdAt: chatDetail.createdAt,
          muted: false,
          unreadMessagesCount: 0,
          lastMessage:
            (payloadData?.attachments?.length ?? 0) > 0
              ? "[Attachment]"
              : payloadData.content,
          lastMessageSenderUsername: payloadData.senderUsername,
          lastMessageSentAt: payloadData.sentAt,
        };

        setChats((prevChats) => {
          const existingIndex = prevChats.findIndex(
            (c) => c.chatId === currentChatId
          );

          if (existingIndex !== -1) {
            // Update existing chat
            const updatedChats = [...prevChats];
            updatedChats[existingIndex] = {
              ...updatedChats[existingIndex],
              ...chat,
            };

            // Move to top
            return [
              updatedChats[existingIndex],
              ...updatedChats.filter((_, idx) => idx !== existingIndex),
            ];
          } else {
            // Add new chat to top
            return [chat, ...prevChats];
          }
        });
      } catch (e) {
        console.error("Failed to fetch chat info:", e);
      }
    } else {
      fetchChats();
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
        addMessage,
        addChat,
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
