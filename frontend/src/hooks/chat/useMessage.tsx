import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import SockJS from "sockjs-client";
import {Client, type StompSubscription} from "@stomp/stompjs";
import type {ChatMessageResponse} from "@/api";

interface MessageContextType {
	wsConnected: boolean;
	sendMessage: (destination: string, body: any) => void;
	subscribe: (
		destination: string,
		callback: (msg: MessagePayload) => void
	) => StompSubscription | undefined;
}

export interface MessagePayload {
	eventType: string;
	data: ChatMessageResponse
}

export const MessageContext = createContext<MessageContextType | undefined>(
	undefined
);

export const MessageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [wsConnected, setWsConnected] = useState(false);
	const clientRef = useRef<Client | null>(null);

	useEffect(() => {
		const client = new Client({
			webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
			connectHeaders: {
				Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
			},
			debug: (str) => console.log("[STOMP Debug]", str),
			reconnectDelay: 5000,
		});

		client.onConnect = () => {
			console.log("[WS] WebSocket connected");
			setWsConnected(true);
		};

		client.onDisconnect = () => {
			console.log("[WS] WebSocket disconnected");
			setWsConnected(false);
		};

		client.onStompError = (frame) => {
			console.error("[WS] STOMP error:", frame);
			setWsConnected(false);
		};

		client.onWebSocketError = (error) => {
			console.error("[WS] WebSocket error:", error);
			setWsConnected(false);
		};

		client.activate();
		clientRef.current = client;

		return () => {
			console.log("[WS] 🔄 Cleaning up STOMP client...");
			client.deactivate()
				.then(() => console.log("[WS] Client deactivated"))
				.catch(err => console.error("[WS] Error during deactivate:", err));
		};
	}, []);

	const subscribe = (
		destination: string,
		callback: (msg: MessagePayload) => void
	): StompSubscription | undefined => {
		if (clientRef.current?.active) {
			return clientRef.current.subscribe(destination, (message) => {
				callback(JSON.parse(message.body));
			});
		} else {
			console.warn("[WS] Cannot subscribe: WS not connected");
		}
	};

	const sendMessage = (destination: string, body: MessagePayload) => {
		if (clientRef.current?.active) {
			clientRef.current.publish({
				destination,
				body: JSON.stringify(body),
			});
			console.log("[WS] Sent:", destination, body); // log to debug
		} else {
			console.warn("[WS] Cannot send: WS not connected");
		}
	};

	return (
		<MessageContext.Provider value={{wsConnected, sendMessage, subscribe}}>
			{children}
		</MessageContext.Provider>
	);
};

export const useMessage = () => {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error("useMessage must be used within a MessageProvider");
	}
	return context;
};
