export type ConversationType = 'dm' | 'group' | 'assistant';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participantIds: string[];
  type: ConversationType;
  conversationKey: string;
}
