import type { Conversation } from "../shared/contract/contract";
import type { ConversationRowViewModel } from "../conversation";

/** Props accepted by the ConversationList container, including selection and async state. */
export type ConversationListProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  onSelectConversation: (conversationId: string) => void;
};

/** Props consumed by the pure ConversationList view, using pre-computed row view models. */
export type ConversationListViewProps = {
  rows: ConversationRowViewModel[];
  isLoading: boolean;
  error: string | null;
  onSelectConversation: (conversationId: string) => void;
};