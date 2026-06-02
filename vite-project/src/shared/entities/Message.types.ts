export type SenderRole = 'user' | 'assistant';

export type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderRole;
  timestamp: string;
};
