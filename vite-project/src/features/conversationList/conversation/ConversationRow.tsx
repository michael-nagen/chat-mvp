import type { Conversation } from '../../../shared/entities/Conversation.types';
import { ConversationRowProvider } from './ConversationRowProvider';
import { useConversationRow } from './ConversationRow.use';
import { ConversationRowView } from './Conversation.view';

type ConversationRowProps = {
  conversation: Conversation;
};

function ConversationRowContainer(): React.JSX.Element {
  const viewProps = useConversationRow();

  return <ConversationRowView {...viewProps} />;
}

export function ConversationRow({ conversation }: ConversationRowProps): React.JSX.Element {
  return (
    <ConversationRowProvider conversation={conversation}>
      <ConversationRowContainer />
    </ConversationRowProvider>
  );
}
