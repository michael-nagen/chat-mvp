import type { Conversation } from "../../shared/entities/Conversation.types";

/** Props consumed by the pure ConversationList view. */
export type ConversationListViewProps = {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
};
