import type {ChatMessageResponse} from "@/api";
import {Card} from "@/components/ui/card.tsx";
import {useAuth} from "@/context/authentication/AuthContext.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import MessageAttachments from "@/components/chat/MessageAttachments.tsx";
import {formatDistanceToNow} from "date-fns";

interface MessageBubbleProps {
	message: ChatMessageResponse;
}

const BASE_URL = "http://localhost:8080/";

const MessageBubble = ({message}: MessageBubbleProps) => {

	const getYouTubeId = (url: string) => {
		const regex =
			/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	};

	const timeLabel = message.sentAt
		? formatDistanceToNow(new Date(message.sentAt), {addSuffix: true})
		: "";

	const {user} = useAuth();

	const isMe = user?.id === message.senderId;

	return (
		<div className={`flex gap-2 mb-2 ${isMe ? "justify-end" : "justify-start"}`}>
			{/* Avatar for other users */}
			{!isMe && (
				<Avatar className="h-10 w-10">
					{message.senderProfileImage ? (
						<AvatarImage src={`${BASE_URL}${message.senderProfileImage}`} alt={message.senderUsername ?? "?"}/>
					) : (
						<AvatarFallback>
							{message.senderUsername?.charAt(0) ?? "?"}
						</AvatarFallback>
					)}
				</Avatar>
			)}

			{/* Message content + attachments */}
			<Card
				className={`p-3 flex flex-col gap-1 break-words 
    ${isMe ? "bg-sky-100 text-sky-900 ml-auto" : "bg-gray-100 text-gray-900 mr-auto"} 
    max-w-[400px]`}
			>
				{/* Sender name for other users */}
				{!isMe && message.senderUsername && (
					<span className="text-xs font-semibold">{message.senderUsername}</span>
				)}

				{/* Message text */}
				{message.content && (
					<div>
						{message.content.split(/\s+/).map((word, i) => {
							const videoId = getYouTubeId(word);
							if (videoId) {
								return (
									<div key={i} className="my-2">
										<iframe
											width="300"
											height="170"
											src={`https://www.youtube.com/embed/${videoId}`}
											title="YouTube video player"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											className="rounded"
										/>
									</div>
								);
							}
							return <span key={i}>{word} </span>;
						})}
					</div>
				)}
				{/*{message.content && <p className="break-words">{message.content}</p>}*/}

				{/* Attachments */}
				{message.attachments && <MessageAttachments attachments={message.attachments}/>}

				{/* Timestamp */}
				{message.sentAt && (
					<span
						className={`text-xs text-muted-foreground ${
							!isMe ? "text-right self-end" : "text-left self-start"
						}`}
					>
						{timeLabel}
					</span>
				)}
			</Card>
		</div>
	);
};

export default MessageBubble;
