export type ConversationType = 'dm' | 'group';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participantIds: string[];
  type: ConversationType;
  // Normalized "one DM per pair" key (sorted participant ids joined). Present
  // only on DMs; a partial unique index enforces uniqueness over it.
  dmKey?: string;
}
