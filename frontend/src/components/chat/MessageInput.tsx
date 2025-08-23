import { useChat } from "@/context/chat/ChatContext";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAuth } from "@/context/chat/test/AuthContext";

interface MessageInputProps {
  onMessageSent?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onMessageSent }) => {
  const [content, setContent] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  const { token } = useAuth();
  const { currentChatId, setChatMessages, setConversations } = useChat();

  // Initialize STOMP client
  useEffect(() => {
    console.log("Initializing STOMP client...");
    const socket = new SockJS(`http://localhost:8080/ws`);
    
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    client.onConnect = () => {
      console.log("STOMP connected");
      setConnected(true);

      if (currentChatId) {
        console.log(`Subscribing to chat topic: /topic/chat/${currentChatId}`);
        client.subscribe(`/topic/chat/${currentChatId}`, (message) => {
          const body = JSON.parse(message.body);
          const newMessage = body.data;

          console.log("📩 Received message:", newMessage);

          setChatMessages((prev) => [...(prev ?? []), newMessage]);

          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
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

    client.onStompError = (frame) => {
      console.error("❌ STOMP protocol error:", frame);
    };

    client.onWebSocketError = (evt) => {
      console.error("❌ WebSocket error:", evt);
    };

    client.onWebSocketClose = (evt) => {
      console.log("⚠️ WebSocket closed:", evt);
      setConnected(false);
    };

    client.activate();
    setStompClient(client);

    return () => {
      console.log("Deactivating STOMP client");
      client.deactivate();
      setConnected(false);
    };
  }, [currentChatId, token]);

  const handleSend = () => {
    if (!currentChatId || !content.trim() || !stompClient || !connected) {
      console.warn("Cannot send: not connected or missing chat/content");
      return;
    }

    const message = { content, attachments: [] };
    console.log("📤 Sending message:", message);

    stompClient.publish({
      destination: `/app/chat.send.${currentChatId}`,
      body: JSON.stringify(message),
    });

    setContent("");
    onMessageSent?.();
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center p-4 border-t">
      <Textarea
        className="flex-1 border rounded px-3 py-2 mr-2 resize-none"
        placeholder="Type a message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleEnter}
      />
      <Button onClick={handleSend} disabled={!connected}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
