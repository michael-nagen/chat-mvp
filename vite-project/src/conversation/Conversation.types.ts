import type { Conversation } from '../shared/contract/contract';

/** A single conversation row with a pre-computed selection flag. */
export type ConversationRowViewModel = {
  conversation: Conversation;
  isSelected: boolean;
};
