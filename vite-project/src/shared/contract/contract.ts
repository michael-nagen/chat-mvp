/** A single chat message belonging to a conversation. */
export type Message = {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderRole;
  timestamp: string;
};

/** A chat thread that groups messages between participants. */
export type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participantIds: string[];
};

/** Identifies whether a message was sent by the human user or the AI assistant. */
export type SenderRole = 'user' | 'assistant' ;

export type User = {
  id: string;
  name: string;
};
