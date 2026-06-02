import type { Conversation } from '../../../shared/entities/Conversation.types';

export type ConversationRowContextValue = {
  conversation: Conversation;
};

export type ConversationRowViewProps = {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
};
