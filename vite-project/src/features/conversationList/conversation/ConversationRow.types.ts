import type { Conversation } from '../../../shared/entities/Conversation.types';

export type ConversationRowProps = {
  conversation: Conversation;
};

export type ConversationRowViewProps = {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
};
