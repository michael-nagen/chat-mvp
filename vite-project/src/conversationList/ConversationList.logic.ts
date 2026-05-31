import type {
  ConversationListProps,
  ConversationListViewProps,
} from "./ConversationList.types";

/** Computes isSelected per row so the view doesn't need to know about selectedConversationId. */
export function buildConversationListViewProps(
  props: ConversationListProps,
): ConversationListViewProps {
  return {
    rows: props.conversations.map((c) => ({
      conversation: c,
      isSelected: c.id === props.selectedConversationId,
    })),
    isLoading: props.isLoading,
    error: props.error,
    onSelectConversation: props.onSelectConversation,
  };
}
