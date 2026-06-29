import type { UserSummary } from './User.types';

export type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  // Public summaries of every participant; the source for message sender avatars.
  participants: UserSummary[];
};
