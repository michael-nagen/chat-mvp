export type SenderRole = 'user' | 'assistant';

export type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderRole;
  // Raw author id, kept for resolving the sender's avatar/name from participants.
  senderId: string;
  timestamp: string;
};

// Wire shape from the backend: senderId is the raw author id, mapped to a caller-relative sender.
export type RawMessage = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  timestamp: string;
};
