export interface Message {
    id: number;
    senderId: number;
    senderNickname: string;
    senderPicUrl: string;
    recipientId: number;
    recipientNickname: string;
    recipientPicUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}
