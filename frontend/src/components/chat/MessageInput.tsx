import type { ChatMessageResponse } from "@/api";
import { useChat } from "@/context/chat/ChatContext";
import { Client } from "@stomp/stompjs";
import { Plus, Send } from "lucide-react";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import PreviewTab from "./PreviewTab";
import apiAttachment from "@/services/chat/apiAttachment";

const MessageInput = () => {
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);
  const [wsConnection, setWsConnection] = useState<boolean>(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  const { currentChatId, addMessage, addChat } = useChat();

  useEffect(() => {
    console.log("[WS] Initializing STOMP client...");

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      debug: (str) => {
        console.log("[STOMP Debug]", str);
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("[WS] ✅ Connected to STOMP server");
      setWsConnection(true);

      if (currentChatId) {
        console.log(`[WS] Subscribing to /topic/chat/${currentChatId}`);
        client.subscribe(`/topic/chat/${currentChatId}`, (message) => {
          console.log("[WS] 📩 Raw message:", message);

          try {
            const payload = JSON.parse(message.body);
            console.log("[WS] ✅ Parsed payload:", payload);

            addMessage(payload.data as ChatMessageResponse);
            addChat(payload.data as ChatMessageResponse);
          } catch (err) {
            console.error("[WS] ❌ Failed to parse message:", err);
          }
        });
      }
    };

    client.onStompError = (frame) => {
      console.error("[WS] ❌ Broker error:", frame.headers["message"]);
      console.error("[WS] Details:", frame.body);
    };

    client.onWebSocketClose = () => {
      console.warn("[WS] 🔌 Connection closed");
      setWsConnection(false);
    };

    client.onWebSocketError = (err) => {
      console.error("[WS] ⚠️ WebSocket error:", err);
    };

    client.activate();
    setStompClient(client);

    return () => {
      console.log("[WS] 🔄 Cleaning up STOMP client...");
      client.deactivate();
    };
  }, [currentChatId]);

  useEffect(() => {
    return () => {
      previewFiles.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    console.log("[Upload] 📂 Selected files:", Array.from(selectedFiles));

    setFiles(selectedFiles);

    const previews = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewFiles(previews);
  };

  const handleSendMessage = async () => {
    if (!wsConnection || !stompClient || !currentChatId) {
      console.warn(
        "[WS] ❌ Cannot send: client not connected or chatId missing"
      );
      return;
    }

    try {
      let attachmentIds: string[] = [];

      if (files && files.length > 0) {
        console.log("[Upload] 🚀 Uploading files...");
        const fileArray = Array.from(files);

        const res = await apiAttachment.upload(currentChatId, fileArray);
        console.log("[Upload] 📡 Upload response:", res);

        attachmentIds =
          res.data && res.data?.length > 0
            ? res.data
                .map((att) => att.attachmentId)
                .filter((id): id is string => typeof id === "string")
            : [];

        console.log("[Upload] ✅ Extracted attachmentIds:", attachmentIds);
      }

      const cleanedContent = content.trim().replace(/\r?\n/g, "\n");

      const messagePayload = {
        content: cleanedContent,
        attachments: attachmentIds,
      };

      console.log("[WS] 🚀 Sending message payload:", messagePayload);

      stompClient.publish({
        destination: `/app/chat.send.${currentChatId}`,
        body: JSON.stringify(messagePayload),
      });

      console.log("[WS] ✅ Message sent");

      setContent("");
      setFiles(null);
      setPreviewFiles([]);
    } catch (error: any) {
      if (error.response) {
        console.error("[API] ❌ Error response:", error.response);
      } else {
        console.error("[Message] ❌ Failed to send message:", error);
      }
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
      {previewFiles.length > 0 && (
        <PreviewTab previewFiles={previewFiles} files={files} />
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
