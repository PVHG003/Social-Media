import type { ChatMessageResponse } from "@/api";
import MessageBubble from "./MessageBubble";

const sampleMessageData: ChatMessageResponse[] = [
  {
    messageId: "1",
    senderId: "user1",
    senderUsername: "Alice",
    senderProfileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "Hello, how are you?",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    deleted: false,
    fromMe: false,
  },
  {
    messageId: "2",
    senderId: "user2",
    senderUsername: "Bob",
    senderProfileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "I’m good, just got back from work 🚀",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 min ago
    deleted: false,
    fromMe: true,
  },
  {
    messageId: "3",
    senderId: "user1",
    senderUsername: "Alice",
    senderProfileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "Check out this cute dog picture 🐶",
    attachments: [
      {
        attachmentId: "att1",
        filePath:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
        contentType: "image/jpeg",
        uploaderId: "user1",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        attachmentId: "att2",
        filePath:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
        contentType: "image/jpeg",
        uploaderId: "user1",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        attachmentId: "att3",
        filePath:
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
        contentType: "image/jpeg",
        uploaderId: "user1",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    deleted: false,
    fromMe: false,
  },
  {
    messageId: "4",
    senderId: "user2",
    senderUsername: "Bob",
    senderProfileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Awesome! Here’s the project doc 📄",
    attachments: [
      {
        attachmentId: "att2",
        filePath:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        contentType: "application/pdf",
        uploaderId: "user2",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      },
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    deleted: false,
    fromMe: true,
  },
  {
    messageId: "5",
    senderId: "user1",
    senderUsername: "Alice",
    senderProfileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "Here’s another one 📸",
    attachments: [
      {
        attachmentId: "att3",
        filePath:
          "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800",
        contentType: "image/jpeg",
        uploaderId: "user1",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      },
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    deleted: false,
    fromMe: false,
  },
  {
    messageId: "6",
    senderId: "user3",
    senderUsername: "Charlie",
    senderProfileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    content: "Hey guys, just joined the chat 👋",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    deleted: false,
    fromMe: false,
  },
  {
    messageId: "7",
    senderId: "user2",
    senderUsername: "Bob",
    senderProfileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Welcome Charlie! 🎉",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    deleted: false,
    fromMe: true,
  },
  {
    messageId: "8",
    senderId: "user3",
    senderUsername: "Charlie",
    senderProfileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    content: "Thanks! Here’s a cool video I found 📹",
    attachments: [
      {
        attachmentId: "att4",
        filePath:
          "http://localhost:8080/uploads/c0a8d745-ab48-4a62-b0e8-74f17d7e7617/chats/6737b287-a842-400f-ac28-6c9f90c463cd/attachments/5c1df7b4-3b0b-4910-9e5b-dfd5f11ab2f2.mp4",
        contentType: "video/mp4",
        uploaderId: "user3",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    deleted: false,
    fromMe: false,
  },
  {
    messageId: "9",
    senderId: "user1",
    senderUsername: "Alice",
    senderProfileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "That’s awesome! Also, here’s a spreadsheet 📊",
    attachments: [
      {
        attachmentId: "att5",
        filePath:
          "https://file-examples.com/storage/fe5b5bbcb48e6f1a8e8c92c/2017/02/file_example_XLSX_10.xlsx",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploaderId: "user1",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    deleted: false,
    fromMe: false,
  },
  {
    messageId: "10",
    senderId: "user2",
    senderUsername: "Bob",
    senderProfileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Cool, I’ll review that later. Here’s a ZIP 📦",
    attachments: [
      {
        attachmentId: "att6",
        filePath:
          "https://file-examples.com/storage/fe5b5bbcb48e6f1a8e8c92c/2017/02/zip_10MB.zip",
        contentType: "application/zip",
        uploaderId: "user2",
        uploadedAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      },
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    deleted: false,
    fromMe: true,
  },
];

const MessageList = () => {
  return (
    <div className="p-4 flex flex-col gap-2">
      {sampleMessageData.map((msg) => (
        <MessageBubble key={msg.messageId} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
