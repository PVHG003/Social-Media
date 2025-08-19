export interface AttachmentDto {
    id: number;
    url: string;
    type: string;
}

export interface ChatRoomDto {
    id: number;
    type: string;
    name: string;
    coverImage?: string;
}

export interface UserDto {
    id: number;
    username: string;
    profileImage?: string;
}

export interface MessageResponse {
    id: number;
    chatRoom: ChatRoomDto;
    sender: UserDto;
    content: string;
    attachments: AttachmentDto[];
    read: boolean;
    sentAt: string;
}

export interface ChatMessage {
    senderId: number;
    content: string;
    attachments: string[];
}
