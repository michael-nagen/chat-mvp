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

// FE contract shape. `sender` is relative to the caller (see messages.mapper).
export type MessageResponse = {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
};

export type MessagePageResponse = {
  messages: MessageResponse[];
  nextCursor: string | null;
};
