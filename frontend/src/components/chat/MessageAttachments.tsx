import type {AttachmentResponse} from "@/api";
import {Card} from "@/components/ui/card.tsx";

interface MessageAttachmentsProps {
	attachments: AttachmentResponse[] | undefined;
}

const BASE_URL = "http://localhost:8080/";

const MessageAttachments = ({attachments}: MessageAttachmentsProps) => {
	const truncateAttachmentName = (fileName: string, maxLength = 20): string => {
		const parts = fileName.split(".");
		const ext = parts.length > 1 ? parts.pop()! : "";
		const baseName = parts.join(".");

		if (baseName.length <= maxLength) {
			return ext ? `${baseName}.${ext}` : baseName;
		}

		const truncated = baseName.substring(0, maxLength) + "...";
		return ext ? `${truncated}.${ext}` : truncated;
	};

	if (!attachments || attachments.length === 0) return null;

	return (
		<div className="flex flex-col gap-2 mt-2">
			{attachments.map((att, idx) => {
				// Handle image attachments
				if (att.contentType?.startsWith("image/")) {
					return (
						<Card key={idx} className="p-1">
							<img
								src={`${BASE_URL}${att.filePath}`}
								alt={truncateAttachmentName(att.fileName) ?? "attachment"}
								className="rounded-md max-h-64 object-contain w-full"
							/>
						</Card>
					);
				}

				if (att.contentType?.startsWith("video/")) {
					return (
						<Card key={idx} className="p-1 max-w-[300px]">
							<video
								src={`${BASE_URL}${att.filePath}`}
								controls
								className="w-full rounded"
							/>
						</Card>
					);
				}
				// Handle other file types
				return (
					<Card
						key={idx}
						className="p-2 flex items-center justify-between gap-2 bg-gray-50 hover:bg-gray-100 transition-colors"
					>
						<span className="truncate">{truncateAttachmentName(att.fileName) ?? "Unknown file"}</span>
						<a
							href={`${BASE_URL}${att.filePath}`}
							download
							className="text-xs text-sky-500 hover:underline"
						>
							Download
						</a>
					</Card>
				);
			})}
		</div>
	);
};

export default MessageAttachments;
