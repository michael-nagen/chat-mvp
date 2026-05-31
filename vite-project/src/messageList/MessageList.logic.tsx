import { useMessageList } from "./MessageList.use";
import { MessageListView } from "./MessageList.view";

/** Self-contained message thread — fetches its own data via ChatContext. */
export function MessageList() {
  const viewProps = useMessageList();
  return <MessageListView {...viewProps} />;
}
