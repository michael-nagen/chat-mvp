export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string; // ISO 8601 timestamp
};

export type MessagePage = {
  messages: Message[];
  nextCursor: string | null;
};

export type GetMessagesOptions = {
  cursor?: string;
  limit: number;
};
