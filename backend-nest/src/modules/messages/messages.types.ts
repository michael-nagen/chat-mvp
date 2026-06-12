export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface MessagePageResponse {
  messages: MessageResponse[];
  nextCursor: string | null;
}
