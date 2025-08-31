import type {ChatMessageResponse} from "@/api";
import MessageBubble from "@/components/chat/MessageBubble.tsx";

interface MessagingThreadProps {
	messages: ChatMessageResponse[];
}

const MessagingThread = ({messages}: MessagingThreadProps) => {
	return (
		<div className="flex flex-col gap-2">
			{messages.map((message) => (
				<MessageBubble key={message.messageId} message={message}/>
			))}
		</div>
	);
};

export default MessagingThread;
