export type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderRole;
  timestamp: string;
};

export type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
};

export type SenderRole = 'user' | 'assistant' ;
