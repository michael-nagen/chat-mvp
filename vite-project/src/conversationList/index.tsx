import { useConversationList } from "./ConversationList.use";
import { ConversationListView } from "./ConversationList.view";

/** Self-contained conversation list — fetches its own data via ChatContext. */
export function ConversationList() {
  const viewProps = useConversationList();
  return <ConversationListView {...viewProps} />;
}
