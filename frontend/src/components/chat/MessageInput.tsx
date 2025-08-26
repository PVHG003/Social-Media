import React, { useCallback, useState } from "react";
import { Plus, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import PreviewTab from "./PreviewTab";
import { useChat } from "@/context/chat/ChatContext";
import apiAttachment from "@/services/chat/apiAttachment";
import { useStompClient } from "@/hooks/useStompClient";
import { useFilePreview } from "@/hooks/useFilePreview";
import type { IMessage } from "@stomp/stompjs";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const { currentChatId, addChat, addMessage } = useChat();
  const { files, previews, handleFileChange, clearFiles } = useFilePreview();

  const handleMessage = useCallback((message: IMessage) => {
    console.log("[WS] 📩 Raw message received:", message);
    if (!message.body) return;

    try {
      const payload = JSON.parse(message.body);
      console.log("[WS] 📦 Parsed payload:", payload);

      addMessage(payload.data);
      addChat(payload.data);
    } catch (err) {
      console.error("[WS] ❌ Failed to parse message", err);
    }
  }, [addChat, addMessage]);

  const { stompClient, connected } = useStompClient(
    currentChatId,
    handleMessage
  );

  const handleSendMessage = useCallback(async () => {
    if (!connected || !stompClient || !currentChatId) {
      console.warn(
        "[WS] ❌ Cannot send: client not connected or chatId missing"
      );
      return;
    }

    try {
      let attachmentIds: (string | undefined)[] = [];
      if (files && files.length > 0) {
        console.log("[Upload] 🚀 Uploading files...");
        const response = await apiAttachment.upload(
          currentChatId,
          Array.from(files)
        );
        attachmentIds = response.data
          .map((a) => a.attachmentId)
          .filter((id): id is string => Boolean(id));

        console.log("[Upload] ✅ Attachment IDs:", attachmentIds);
      }

      console.log("Content: ", content);
      console.log("AttachmentIds: ", attachmentIds);

      stompClient.publish({
        destination: `/app/chat.send.${currentChatId}`,
        body: JSON.stringify({
          content: content.trim(),
          attachments: attachmentIds,
        }),
      });

      setContent("");
      clearFiles();
    } catch (err) {
      console.error("[Message] ❌ Failed to send:", err);
    }
  }, [connected, stompClient, currentChatId, files, content, clearFiles]);

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage().then((r) => console.log(r));
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-full">
      {previews.length > 0 && (
        <PreviewTab previewFiles={previews} files={files} />
      )}

      <div className="flex items-center gap-4 w-full">
        {/* File upload */}
        <div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <label htmlFor="file-upload">
              <Plus className="h-5 w-5" />
            </label>
          </Button>
        </div>

        {/* Message input */}
        <Textarea
          placeholder="Type your message here ..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleEnterKeyDown}
          className="flex-1"
        />

        {/* Send button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleSendMessage}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
