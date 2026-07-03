export type ConversationType = 'dm' | 'group' | 'assistant' | 'tutor';

const AI_CONVERSATION_TYPES: readonly ConversationType[] = ['assistant', 'tutor'];

export const isAiConversationType = (type: ConversationType): boolean =>
  AI_CONVERSATION_TYPES.includes(type);

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participantIds: string[];
  type: ConversationType;
  conversationKey: string;
}
