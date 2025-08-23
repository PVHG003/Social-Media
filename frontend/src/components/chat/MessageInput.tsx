import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PlusCircle, Send, X } from "lucide-react";
import { useAuth } from "@/context/chat/test/AuthContext";
import { useChat } from "@/context/chat/ChatContext";
import apiAttachment from "@/services/chat/apiAttachment";

interface MessageInputProps {
  onMessageSent?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onMessageSent }) => {
  // Text and files
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WS
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  const { token } = useAuth();
  const { currentChatId, setChatMessages, setConversations } = useChat();

  // --- Setup STOMP client ---
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${token}` },
    });

    client.onConnect = () => {
      setConnected(true);
      if (currentChatId) {
        client.subscribe(`/topic/chat/${currentChatId}`, (message) => {
          const body = JSON.parse(message.body);
          const newMessage = body.data;

          setChatMessages((prev) => [...(prev ?? []), newMessage]);
          setConversations((prev) =>
            prev.map((conv) =>
              conv.chatId === currentChatId
                ? {
                    ...conv,
                    lastMessage: newMessage.content,
                    lastMessageSenderUsername: newMessage.senderUsername,
                    lastMessageSentAt: newMessage.sentAt,
                  }
                : conv
            )
          );
        });
      }
    };

    client.onWebSocketClose = () => setConnected(false);
    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [currentChatId, token]);

  // --- Handlers ---
  const handleSend = async () => {
    if (!currentChatId || (!content.trim() && files.length === 0)) return;
    if (!stompClient || !connected) return;

    setLoading(true);
    setError(null);

    try {
      let attachmentIds: string[] = [];

      if (files.length > 0) {
        const response = await apiAttachment.upload(currentChatId, files);
        const uploaded = response.data || [];
        attachmentIds = uploaded
          .map((att) => att.attachmentId)
          .filter((id): id is string => Boolean(id));
      }

      const message = { content: content.trim(), attachments: attachmentIds };

      stompClient.publish({
        destination: `/app/chat.send.${currentChatId}`,
        body: JSON.stringify(message),
      });

      onMessageSent?.();

      setContent("");
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      console.error("Failed to send message", err);
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleAttachmentChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- Render ---
  return (
    <div className="flex flex-col border-t">
      {/* File previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 p-2 flex-wrap">
          {previews.map((src, idx) => (
            <div key={idx} className="relative">
              <img
                src={src}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
              <button
                className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-full"
                onClick={() => removeFile(idx)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm px-4">{error}</p>}

      <div className="flex items-center p-4">
        {/* File picker */}
        <Label className="cursor-pointer">
          <Input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) =>
              handleAttachmentChange(
                e.target.files ? Array.from(e.target.files) : []
              )
            }
          />
          <Button asChild variant="outline" disabled={!connected || loading}>
            <span>{loading ? "Sending..." : <PlusCircle />}</span>
          </Button>
        </Label>

        {/* Text input */}
        <Textarea
          className="flex-1 border rounded px-3 py-2 mx-2 resize-none"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleEnter}
          disabled={!connected || loading}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={
            !connected ||
            loading ||
            (content.trim() === "" && files.length === 0)
          }
        >
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
