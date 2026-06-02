import type { ConversationRowsProps } from '../ConversationList.types';
import { ConversationRow } from '../conversation';
import { conversationListStyles } from './ConversationList.styles';

/** The scrollable column of selectable conversation rows. */
export function ConversationRows({ conversations }: ConversationRowsProps): React.JSX.Element {
  return (
    <div style={conversationListStyles.column}>
      {conversations.map((conversation) => (
        <ConversationRow key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
