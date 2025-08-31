import type {ChatDetailResponse} from "@/api";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";

interface MessagingHeaderProps {
	chat: ChatDetailResponse | null;
}

const MessagingHeader = ({chat}: MessagingHeaderProps) => {
	return (
		<div className="flex items-center gap-3">
			{/* Avatar */}
			<Avatar className="h-10 w-10">
				<AvatarImage src={chat?.chatDisplayImage || ""}/>
				<AvatarFallback>
					{chat?.chatDisplayName?.charAt(0) ?? "?"}
				</AvatarFallback>
			</Avatar>

			{/* Name + status */}
			<div className="flex flex-col">
				<p className="font-medium text-sm">
					{chat?.chatDisplayName ?? "Unknown"}
				</p>
				<p className="text-xs text-muted-foreground">Online</p>
			</div>
		</div>
	);
};

export default MessagingHeader;
