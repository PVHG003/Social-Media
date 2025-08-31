import {useChat} from "@/hooks/chat/useChat";
import MessagingHeader from "./MessagingHeader";
import MessagingInput from "./MessagingInput";
import MessagingThread from "./MessagingThread";
import {useEffect, useRef, useState} from "react";

interface MessagingPanelProps {
	chatId: string | undefined;
}

const MessagingPanel = ({chatId}: MessagingPanelProps) => {
	const {
		chat,
		messages,
		fetchChatDetail,
		fetchChatMessages,
		isLoadingChatDetail,
		messageHasMore,
		isLoadingMessages
	} = useChat();

	const scrollRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Scroll to bottom
	const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
		scrollRef.current?.scrollIntoView({behavior});
	};

	useEffect(() => {
		// If loading more, don't auto-scroll to bottom
		if (isLoadingMore) {
			setIsLoadingMore(false);
			return;
		}
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (!chatId) return;

		Promise.all([fetchChatDetail(chatId), fetchChatMessages(chatId)])
			.then(() => console.log("[All fetches complete]"))
			.catch(err => console.error("[One or more fetches failed]", err));
	}, [chatId]);

	const handleLoadMore = async () => {
		if (!chatId || !containerRef.current) return;

		const container = containerRef.current;
		const prevScrollHeight = container.scrollHeight;

		setIsLoadingMore(true);
		await fetchChatMessages(chatId);

		// After messages are prepended, adjust scroll so user stays at same position
		const newScrollHeight = container.scrollHeight;
		container.scrollTop += newScrollHeight - prevScrollHeight;
	};

	if (isLoadingChatDetail) {
		return (
			<div className="flex flex-1 items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col h-full">
			{/* Header */}
			<div className="px-4 py-2 border-b border-border">
				<MessagingHeader chat={chat}/>
			</div>

			{/* Messages (scrollable) */}
			<div className="flex-1 overflow-y-auto px-4 py-2" ref={containerRef}>
				{messageHasMore && (
					<div className="flex justify-center mb-2">
						<button
							className="px-4 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
							onClick={handleLoadMore}
							disabled={isLoadingMessages}
						>
							{isLoadingMessages ? "Loading..." : "Load more"}
						</button>
					</div>
				)}
				<MessagingThread messages={messages}/>
				<div ref={scrollRef}/>
			</div>

			{/* Input */}
			<div className="border-t px-4 py-2">
				<MessagingInput/>
			</div>
		</div>
	);
};

export default MessagingPanel;
