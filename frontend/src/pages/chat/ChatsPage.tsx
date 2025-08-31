import MessagingPanel from "@/components/chat/MessagingPanel";
import ChatSidebar from "@/components/chat/ChatSidebar";
import {useChat} from "@/hooks/chat/useChat";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

const ChatsPage = () => {
	const {chats, fetchChats, selectChat} = useChat();
	const {chatId} = useParams<{ chatId: string }>();
	const navigate = useNavigate();

	useEffect(() => {
		fetchChats()
			.then(() => console.log("[fetchChats] success"))
			.catch(err => console.error("[fetchChats] error:", err));
	}, []);

	useEffect(() => {
		if (!chatId && chats.length > 0) {
			navigate(`/chats/${chats[0].chatId}`);
		}
	}, [chatId, chats]);

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<div className="w-108 border-r">
				<ChatSidebar chats={chats} onSelect={selectChat}/>
			</div>

			{/* Messaging area */}
			<div className="flex-1 flex flex-col">
				{chatId ? (
					<MessagingPanel chatId={chatId}/>
				) : (
					<div className="flex items-center justify-center flex-1 text-muted-foreground">
						Select a chat to view messages
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatsPage;
