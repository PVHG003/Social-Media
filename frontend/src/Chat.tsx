import React, {useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import type {ChatMessage, MessageResponse} from "./types";

interface ChatProps {
    roomId: number;
    currentUserId: number;
}

const Chat: React.FC<ChatProps> = ({roomId, currentUserId}) => {
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [input, setInput] = useState("");
    const [connected, setConnected] = useState(false);
    const stompClient = useRef<Client | null>(null);

    useEffect(() => {
        // const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws", // must match Spring broker URL
            reconnectDelay: 3000,
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                setConnected(true);

                client.subscribe(`/topic/chat/${roomId}`, (message) => {
                    const newMsg: MessageResponse = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMsg]);
                });
            },
            onDisconnect: () => {
                console.log("❌ Disconnected from WebSocket");
                setConnected(false);
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            client.deactivate().then(r => {
                console.log(r)
            });
        };
    }, [roomId]);

    const sendMessage = () => {
        if (!connected || !stompClient.current) {
            console.warn("WebSocket not connected yet");
            return;
        }
        if (input.trim() === "") return;

        const chatMessage: ChatMessage = {
            senderId: currentUserId,
            content: input,
            attachments: [],
        };

        stompClient.current.publish({
            destination: `/app/chat/${roomId}`,
            body: JSON.stringify(chatMessage),
        });

        setInput("");
    };

    return (
        <div style={{maxWidth: "500px", margin: "auto", border: "1px solid #ccc", padding: "10px"}}>
            <h3>Chat Room #{roomId}</h3>
            <div style={{height: "300px", overflowY: "auto", borderBottom: "1px solid #ddd"}}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            textAlign: msg.sender.id === currentUserId ? "right" : "left",
                            margin: "5px 0",
                        }}
                    >
                        <strong>{msg.sender.username}:</strong> <span>{msg.content}</span>
                        {msg.attachments.length > 0 && (
                            <div>
                                {msg.attachments.map((att) => (
                                    <a key={att.id} href={att.url} target="_blank" rel="noreferrer">
                                        {att.type || "Attachment"}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div style={{marginTop: "10px", display: "flex", gap: "5px"}}>
                <input
                    style={{flex: 1}}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} disabled={!connected}>
                    {connected ? "Send" : "Connecting..."}
                </button>
            </div>
        </div>
    );
};

export default Chat;
