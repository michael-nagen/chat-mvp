import { useMessageList } from './MessageList.use';
import { MessageListView } from './components/MessageList.view';

/** Self-contained message thread — fetches its own data for the selected conversation. */
export function MessageList(): React.JSX.Element {
  const viewProps = useMessageList();

  return <MessageListView {...viewProps} />;
}
