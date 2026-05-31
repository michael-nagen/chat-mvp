import type { Conversation } from "../shared/contract/contract";

/** Props accepted by the ConversationList container, including selection and async state. */
export type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelectConversation: (conversationId: string) => void;
};

/** View model for a single conversation row with a pre-computed selection flag. */
export type ConversationRowViewModel = {
  conversation: Conversation;
  isSelected: boolean;
};

/** Props consumed by the pure ConversationList view, using pre-computed row view models. */
export type ConversationListViewProps = {
  rows: ConversationRowViewModel[];
  isLoading: boolean;
  error: string | null;
  onSelectConversation: (conversationId: string) => void;
};