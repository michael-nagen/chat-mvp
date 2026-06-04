export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string; // ISO 8601 timestamp
};
