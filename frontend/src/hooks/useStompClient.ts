import { useEffect, useState, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useStompClient = (
  currentChatId: string | null,
  onMessage: (msg: IMessage) => void
) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  // stable callback wrapper
  const handleMessage = useCallback(
    (message: IMessage) => {
      try {
        onMessage(message);
      } catch (err) {
        console.error("[WS] ❌ Error in message handler:", err);
      }
    },
    [onMessage] // stable ref to parent-provided callback
  );

  // Initialize client once
  useEffect(() => {
    console.log("[WS] Initializing STOMP client...");
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      debug: (str) => console.log("[STOMP Debug]", str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("[WS] ✅ Connected to STOMP server");
      setConnected(true);
    };

    client.onDisconnect = () => {
      console.log("[WS] 🔌 Disconnected");
      setConnected(false);
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
  }, []);

  // Subscribe when chatId changes
  useEffect(() => {
    if (!stompClient || !connected || !currentChatId) {
      console.log("[WS] ⏳ Not ready to subscribe", {
        hasClient: !!stompClient,
        connected,
        currentChatId,
      });
      return;
    }

    console.log(`[WS] 🔄 Subscribing to /topic/chat/${currentChatId}`);
    const subscription = stompClient.subscribe(
      `/topic/chat/${currentChatId}`,
      handleMessage,
      { id: `sub-${currentChatId}` }
    );

    return () => {
      console.log(`[WS] 🔕 Unsubscribing from /topic/chat/${currentChatId}`);
      subscription.unsubscribe();
    };
  }, [stompClient, connected, currentChatId, handleMessage]);

  return { stompClient, connected };
};
