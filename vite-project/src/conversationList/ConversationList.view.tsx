import { ConversationRow } from '../conversation';
import type { ConversationListViewProps } from './ConversationList.types';
import { ConversationSkeletonList } from './children/ConversationSkeletonList';
import { conversationListStyles } from './ConversationList.styles';

/**
 * Displays the list of conversations for the current user.
 *
 * States (in order of priority):
 *  1. Loading      → skeleton rows
 *  2. Error        → inline error text
 *  3. Empty        → empty-state message
 *  4. Conversations → scrollable list, selected row highlighted
 */
export function ConversationListView({
  conversations,
  isLoading,
  error,
}: ConversationListViewProps): React.JSX.Element {
  let content: React.JSX.Element;

  if (isLoading) {
    content = <ConversationSkeletonList />;
  } else if (error) {
    content = <div style={conversationListStyles.error}>{error}</div>;
  } else if (conversations.length === 0) {
    content = <div style={conversationListStyles.center}>No conversations yet</div>;
  } else {
    content = (
      <div style={conversationListStyles.column}>
        {conversations.map((conversation) => (
          <ConversationRow
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </div>
    );
  }

  return content;
}
