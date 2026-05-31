import type { ConversationListProps } from "./ConversationList.types";
import { useConversationList } from "./ConversationList.use";
import { ConversationListView } from "./ConversationList.view";

export type { ConversationListProps } from "./ConversationList.types";

export function ConversationList(props: ConversationListProps) {
  const viewProps = useConversationList(props);
  return <ConversationListView {...viewProps} />;
}
