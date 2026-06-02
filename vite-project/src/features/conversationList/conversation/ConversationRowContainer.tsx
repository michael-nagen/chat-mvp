import { useConversationRow } from './ConversationRow.use';
import { ConversationRowView } from './components/ConversationRow.view';

/** Reads row state from context and feeds the pure row view. */
export function ConversationRowContainer(): React.JSX.Element {
  const viewProps = useConversationRow();

  return <ConversationRowView {...viewProps} />;
}
