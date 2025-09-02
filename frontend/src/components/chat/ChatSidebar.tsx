import type {ChatListResponse} from "@/api";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "../ui/button";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider,} from "../ui/sidebar";
import ChatInfoCard from "./ChatInfoCard";
import {ScrollArea} from "../ui/scroll-area";
import {MdChatBubble} from "react-icons/md";
import {useState} from "react";
import ChatSearchModal from "./ChatSearchModal";

interface ChatSidebarProps {
	chats: ChatListResponse[];
	onSelect: (chatId: string) => void;
}

const ChatSidebar = ({chats, onSelect}: ChatSidebarProps) => {
	const navigate = useNavigate();
	const [modalOpen, setModalOpen] = useState(false);
	const [mode, setMode] = useState<"private" | "group">("private");

	return (
		<SidebarProvider>
			<Sidebar className="w-108 border-r flex flex-col">
				{/* Header */}
				<SidebarHeader className="px-4 py-3.5 border-b flex flex-row gap-2">
					<MdChatBubble className="text-sky-500 text-xl" onClick={() => navigate("/")}/>
					<h2 className="font-semibold text-lg">Chats</h2>
				</SidebarHeader>

				{/* Chat list */}
				<SidebarContent className="flex-1 overflow-y-auto">
					<ScrollArea>
						{chats.map((chat) => (
							<Link
								key={chat.chatId}
								to={`/chat/${chat.chatId}`}
								onClick={() => onSelect(chat.chatId!)}
								className="block hover:bg-accent px-2 py-1 rounded"
							>
								<ChatInfoCard chat={chat}/>
							</Link>
						))}
					</ScrollArea>
				</SidebarContent>

				{/* Footer */}
				<SidebarFooter className="p-3 border-t flex items-center justify-between gap-2">
					<Button
						size="sm"
						className="flex-1"
						onClick={() => {
							setMode("private");
							setModalOpen(true);
						}}
					>
						Private Chat
					</Button>
					<Button
						size="sm"
						className="flex-1"
						onClick={() => {
							setMode("group");
							setModalOpen(true);
						}}
					>
						Group Chat
					</Button>
				</SidebarFooter>
			</Sidebar>
			<ChatSearchModal open={modalOpen} onClose={() => setModalOpen(false)} mode={mode}/>
		</SidebarProvider>
	);
};

export default ChatSidebar;
