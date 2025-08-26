import { useChat } from "@/context/chat/ChatContext";
import { Plus, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import PreviewTab from "./PreviewTab";
import apiAttachment from "@/services/chat/apiAttachment";
import { useStompClient } from "@/hooks/useStompClient";
import { useFilePreview } from "@/hooks/useFilePreview";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const { currentChatId, addMessage, addChat } = useChat();

  const { files, previews, handleFileChange, clearFiles } = useFilePreview();

  const { stompClient, connected } = useStompClient(
    currentChatId,
    (message) => {
      console.log("[WS] 📩 Raw message received:", message);

      if (!message.body) {
        console.error("[WS] ❌ Empty message body received");
        return;
      }

      try {
        const payload = JSON.parse(message.body);
        console.log("[WS] 📦 Parsed message payload:", payload);

        if (!payload.data) {
          console.error("[WS] ❌ No data in payload:", payload);
          return;
        }

        console.log("[WS] 🗂️ Message data:", payload.data);
        
      } catch (err) {
        console.error("[WS] ❌ Failed to process message:", {
          error: err,
          messageBody: message.body,
        });
      }
    }
  );

  const handleSendMessage = async () => {
    if (!connected || !stompClient || !currentChatId) {
      console.warn(
        "[WS] ❌ Cannot send: client not connected or chatId missing"
      );
      return;
    }

    try {
      let attachmentIds: (string | undefined)[] | undefined = [];

      if (files && files.length > 0) {
        console.log("[Upload] 🚀 Uploading files...");
        const res = await apiAttachment.upload(
          currentChatId,
          Array.from(files)
        );
        attachmentIds = res.data?.map((attachment) => attachment.attachmentId);
      }

      const messagePayload = {
        content: content.trim().replace(/\r?\n/g, "\n"),
        attachments: attachmentIds,
      };

      stompClient.publish({
        destination: `/app/chat.send.${currentChatId}`,
        body: JSON.stringify(messagePayload),
      });

      console.log("[WS] ✅ Message sent");
      setContent("");
      clearFiles();
    } catch (error: any) {
      console.error("[Message] ❌ Failed to send message:", error);
    }
  };

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-full">
      {previews.length > 0 && (
        <PreviewTab previewFiles={previews} files={files} />
      )}

      <div className="flex items-center gap-4 w-full">
        <div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full cursor-pointer"
          >
            <label htmlFor="file-upload">
              <Plus className="h-5 w-5" />
            </label>
          </Button>
        </div>

        <Textarea
          placeholder="Type your message here ..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleEnterKeyDown}
          className="flex-1"
        />

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
