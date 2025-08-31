import {useChat} from "@/hooks/chat/useChat";
import {useMessage} from "@/hooks/chat/useMessage";
import {Send} from "lucide-react";
import React, {useEffect, useState} from "react";
import {MdAttachment} from "react-icons/md";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";
import AttachmentPreview from "./AttachmentPreview";
import apiAttachment from "@/services/chat/apiAttachment";

const MessagingInput = () => {
	const {selectedChatId, addMessage, updateChatList} = useChat();
	const {sendMessage, subscribe, wsConnected} = useMessage();

	const [content, setContent] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [sending, setSending] = useState(false);

	useEffect(() => {
		if (!wsConnected || !selectedChatId) return;

		console.log("WebSocket connected, subscribing to chat:", selectedChatId);

		const subscription = subscribe(
			`/topic/chat/${selectedChatId}`,
			(message) => {
				console.log("📩 Received message:", message);
				addMessage(message.data);
				updateChatList(message.data, selectedChatId);
			}
		);

		return () => {
			subscription?.unsubscribe();
			console.log("🛑 Unsubscribed from", selectedChatId);
		};
	}, [selectedChatId, wsConnected, subscribe]);

	const handleSend = async () => {
		if (sending) return;
		if (!selectedChatId || (!content.trim() && files.length === 0)) return;

		setSending(true);

		try {
			let attachmentIds: string[] = [];
			if (files.length > 0) {
				const {data} = await apiAttachment.upload(selectedChatId, files);
				attachmentIds = data?.map((a: any) => a.attachmentId) || [];
			}

			sendMessage(`/app/chat/send/${selectedChatId}`, {
				content,
				attachments: attachmentIds,
			});

			setContent("");
			setFiles([]);
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setSending(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files;
		if (!selectedFiles) return;

		setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
	};

	const handleRemoveFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div>
			<div>
				<AttachmentPreview files={files} onRemove={handleRemoveFile}/>
			</div>
			<div className="flex items-center gap-2 p-2">
				{/* File upload button */}
				<Button variant="ghost" size="icon" asChild>
					<label>
						<input type="file" multiple hidden onChange={handleFileChange}/>
						<MdAttachment className="h-5 w-5 cursor-pointer rotate-45"/>
					</label>
				</Button>

				{/* Textarea (auto-grow) */}
				<Textarea
					placeholder="Type a message..."
					className="flex-1 resize-none min-h-[40px] max-h-[120px]"
					rows={1}
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend()
								.then(() => console.log("[handleSend] sending message..."))
								.catch((err: Error) => console.log("[handleSend] error: ", err));
						}
					}}
				/>

				{/* Send button */}
				<Button size="icon" variant={"ghost"} onClick={handleSend}>
					<Send className="h-5 w-5"/>
				</Button>
			</div>
		</div>
	);
};

export default MessagingInput;
