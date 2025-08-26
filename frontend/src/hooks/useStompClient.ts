import { useEffect, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useStompClient = (
  currentChatId: string | null,
  onMessage: (msg: IMessage) => void
) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

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

    client.onWebSocketClose = () => {
      console.warn("[WS] 🔌 Connection closed");
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

  // handle subscription per chatId
  useEffect(() => {
    if (!stompClient || !connected || !currentChatId) {
      console.log("[WS] ⏳ Not ready to subscribe:", {
        hasClient: !!stompClient,
        connected,
        currentChatId,
      });
      return;
    }

    console.log(`[WS] 🔄 Subscribing to /topic/chat/${currentChatId}`);
    try {
      const subscription = stompClient.subscribe(
        `/topic/chat/${currentChatId}`,
        (message) => {
          console.log(
            `[WS] 📨 Received message on /topic/chat/${currentChatId}:`,
            message
          );
          try {
            onMessage(message);
          } catch (error) {
            console.error("[WS] ❌ Error in message handler:", error);
          }
        },
        { id: `sub-${currentChatId}` }
      );

      console.log(
        `[WS] ✅ Successfully subscribed to /topic/chat/${currentChatId}`
      );

      return () => {
        console.log(`[WS] 🔕 Unsubscribing from /topic/chat/${currentChatId}`);
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("[WS] ❌ Error unsubscribing:", error);
        }
      };
    } catch (error) {
      console.error("[WS] ❌ Failed to subscribe:", error);
    }
  }, [currentChatId]);

  return { stompClient, connected };
};
