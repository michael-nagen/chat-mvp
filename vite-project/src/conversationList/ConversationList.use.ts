import type {
  ConversationListProps,
  ConversationListViewProps,
} from "./ConversationList.types";
import { buildConversationListViewProps } from "./ConversationList.logic";

/** Transforms ConversationListProps into view props by delegating to the pure logic layer. */
export function useConversationList(
  props: ConversationListProps,
): ConversationListViewProps {
  return buildConversationListViewProps(props);
}
