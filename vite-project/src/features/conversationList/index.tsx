import { useConversationList } from './ConversationList.use';
import { ConversationListView } from './components/ConversationList.view';

/** Self-contained conversation list — fetches its own data and updates chat selection. */
export function ConversationList(): React.JSX.Element {
  const viewProps = useConversationList();
  return <ConversationListView {...viewProps} />;
}
