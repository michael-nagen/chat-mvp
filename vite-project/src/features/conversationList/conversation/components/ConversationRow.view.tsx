import type { ConversationRowViewProps } from '../ConversationRow.types';
import { conversationRowStyles } from './ConversationRow.styles';

/** A single conversation row view — highlighted with a blue border when selected. */
export function ConversationRowView({
  conversation,
  isSelected,
  onSelect,
}: ConversationRowViewProps): React.JSX.Element {
  return (
    <div
      onClick={onSelect}
      style={conversationRowStyles.row(isSelected)}
    >
      <div style={conversationRowStyles.title}>{conversation.title}</div>
      {conversation.lastMessage && (
        <div style={conversationRowStyles.preview}>{conversation.lastMessage}</div>
      )}
    </div>
  );
}
