import type { UserSummary } from './User.types';

export type ConversationType = 'dm' | 'group' | 'assistant';

export type Conversation = {
  id: string;
  type: ConversationType;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participants: UserSummary[];
};
