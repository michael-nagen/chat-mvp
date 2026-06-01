import type { ConversationRowViewProps } from './ConversationRow.types';
import { conversationStyles } from './Conversation.styles';

/** A single conversation row view — highlighted with a blue border when selected. */
export function ConversationRowView({
  conversation,
  isSelected,
  onSelect,
}: ConversationRowViewProps): React.JSX.Element {
  return (
    <div
      onClick={onSelect}
      style={conversationStyles.row(isSelected)}
    >
      <div style={conversationStyles.title}>{conversation.title}</div>
      {conversation.lastMessage && (
        <div style={conversationStyles.preview}>{conversation.lastMessage}</div>
      )}
    </div>
  );
}
