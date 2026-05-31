import type { MessageListViewProps } from "./MessageList.types";
import { MessageListView } from "./MessageList.view";

/** Public props alias re-exported so callers import from the logic layer, not the view layer. */
export type MessageListProps = MessageListViewProps;

/** Container component that delegates rendering to MessageListView. */
export function MessageList(props: MessageListProps) {
  return <MessageListView {...props} />;
}
