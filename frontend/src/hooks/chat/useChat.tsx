import type {ChatDetailResponse, ChatListResponse, ChatMessageResponse,} from "@/api";
import chatApi from "@/services/chat/apiChat";
import React, {createContext, useContext, useState} from "react";

interface ChatContextType {
	chat: ChatDetailResponse | null;
	chats: ChatListResponse[];
	selectedChatId: string | null;
	messages: ChatMessageResponse[];

	addMessage: (message: ChatMessageResponse) => void;
	updateChatList: (message: ChatMessageResponse, chatId: string) => void;

	isLoadingChats: boolean;
	isLoadingMessages: boolean;
	isLoadingChatDetail: boolean;

	chatHasMore: boolean;
	messageHasMore: boolean;

	selectChat: (chatId: string) => void;
	fetchChats: () => Promise<void>;
	fetchChatMessages: (chatId: string) => Promise<void>;
	fetchChatDetail: (chatId: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(
	undefined
);

export const ChatProvider = ({children}: { children: React.ReactNode }) => {
	const [chat, setChat] = useState<ChatDetailResponse | null>(null);
	const [chats, setChats] = useState<ChatListResponse[]>([]);
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessageResponse[]>([]);

	const [chatPage, setChatPage] = useState(0);
	const [chatSize] = useState(50);
	const [chatHasMore, setChatHasMore] = useState(true);

	const [messagePage, setMessagePage] = useState(0);
	const [messageSize] = useState(50);
	const [messageHasMore, setMessageHasMore] = useState(true);

	const [isLoadingChats, setIsLoadingChats] = useState(false);
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const [isLoadingChatDetail, setIsLoadingChatDetail] = useState(false);

	const selectChat = (chatId: string) => {
		console.log("[selectChat] Switching to chat:", chatId);
		setSelectedChatId(chatId);
		setMessages([]);
		setMessagePage(0);
		setMessageHasMore(true);

		console.log("[selectChat] Reset messages and fetching first page...");
		fetchChatMessages(chatId, {page: 0, size: messageSize})
			.then(() => console.log("[selectChat] Reset messages from chat:", chatId))
			.catch((err: Error) => console.error("[selectChat] Reset messages from chat:", err));
	};

	const fetchChatDetail = async (chatId: string) => {
		if (!chatId) return;
		setIsLoadingChatDetail(true);
		try {
			const {data} = await chatApi.chat.getInfo(chatId);
			console.log("[fetchChatDetail] API response:", data);
			setChat(data ?? null);
		} catch (error) {
			console.error("[fetchChatDetail] Error:", error);
		} finally {
			setIsLoadingChatDetail(false);
		}
	};

	const fetchChats = async (page = chatPage, size = chatSize) => {
		if (!chatHasMore && page > 0) {
			console.log("[fetchChats] No more chats to load");
			return;
		}

		console.log(`[fetchChats] Fetching page ${page}, size ${size}...`);
		setIsLoadingChats(true);
		try {
			const {data} = await chatApi.chat.list({page, size});
			console.log("[fetchChats] API response:", data);
			const newChats = data ?? [];
			console.log(`[fetchChats] Received ${newChats.length} chats`);

			setChats((prev) => {
				const merged = page === 0 ? newChats : [...prev, ...newChats];

				// Sort descending by lastMessageSentAt (latest first)
				const sorted = merged.sort((a, b) => {
					const timeA = a.lastMessageSentAt ? new Date(a.lastMessageSentAt).getTime() : 0;
					const timeB = b.lastMessageSentAt ? new Date(b.lastMessageSentAt).getTime() : 0;
					return timeB - timeA;
				});

				console.log("[fetchChats] Updated chats count:", sorted.length);
				return sorted;
			});

			setChatHasMore(newChats.length === size);
			setChatPage(page + 1);
		} catch (error) {
			console.error("[fetchChats] Error:", error);
		} finally {
			setIsLoadingChats(false);
		}
	};

	const fetchChatMessages = async (
		chatId: string,
		{page = messagePage, size = messageSize} = {}
	) => {
		if (!messageHasMore && page > 0) {
			console.log("[fetchChatMessages] No more messages to load");
			return;
		}

		console.log(
			`[fetchChatMessages] Chat ${chatId}, fetching page ${page}, size ${size}...`
		);
		setIsLoadingMessages(true);
		try {
			const response = await chatApi.messages.list(chatId, {page, size});
			let newMessages = response.data ?? [];
			console.log(`[fetchChatMessages] Received ${newMessages.length} messages`, newMessages);

			// Reverse to have the oldest messages first
			newMessages = newMessages.reverse();

			setMessages((prev) => {
				const merged = page === 0 ? newMessages : [...newMessages, ...prev];
				console.log(
					"[fetchChatMessages] Updated messages count:",
					merged.length
				);
				return merged;
			});

			setMessageHasMore(newMessages.length === size);
			setMessagePage(page + 1);
		} catch (error) {
			console.error("[fetchChatMessages] Error:", error);
		} finally {
			setIsLoadingMessages(false);
		}
	};

	const addMessage = (message: ChatMessageResponse) => {
		setMessages((prev) => [...prev, message]);
	}

	const updateChatList = (message: ChatMessageResponse, chatId: string) => {
		setChats((prev) => {
			const existingChat = prev.find((chat) => chat.chatId === chatId);

			if (!existingChat) {
				// Chat not found → add a new one (e.g. when it’s the first message in that chat)
				const newChat: ChatListResponse = {
					chatId: chatId,
					lastMessage: message.content,
					lastMessageSenderUsername: message.senderUsername,
					lastMessageSentAt: message.sentAt,
				};
				return [newChat, ...prev];
			}

			// If chat exists, update it
			const updatedChat: ChatListResponse = {
				...existingChat,
				lastMessage: message.content,
				lastMessageSenderUsername: message.senderUsername,
				lastMessageSentAt: message.sentAt,
			};

			// Move updated chat to top of list
			const filtered = prev.filter((chat) => chat.chatId !== chatId);
			return [updatedChat, ...filtered];
		});
	};


	const value = {
		chat,
		chats,
		selectedChatId,
		messages,
		addMessage,
		updateChatList,
		isLoadingChats,
		isLoadingMessages,
		isLoadingChatDetail,
		chatHasMore,
		messageHasMore,
		selectChat,
		fetchChats,
		fetchChatMessages,
		fetchChatDetail,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChat must be used within a ChatProvider");
	}
	return context;
};
