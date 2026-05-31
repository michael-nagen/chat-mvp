import type { ConversationRowViewModel } from './Conversation.types';
import { SELECTED_BG, SELECTED_BORDER_COLOR, SELECTED_BORDER_WIDTH } from './Conversation.constants';

type Props = ConversationRowViewModel & { onSelect: () => void };

/** A single conversation row — highlighted with a blue border when selected. */
export function ConversationRow({ conversation, isSelected, onSelect }: Props): React.JSX.Element {
  return (
    <div
      onClick={onSelect}
      style={{
        ...styles.row,
        background: isSelected ? SELECTED_BG : 'transparent',
        borderLeft: isSelected
          ? `${SELECTED_BORDER_WIDTH} solid ${SELECTED_BORDER_COLOR}`
          : `${SELECTED_BORDER_WIDTH} solid transparent`,
      }}
    >
      <div style={styles.title}>{conversation.title}</div>
      {conversation.lastMessage && (
        <div style={styles.preview}>{conversation.lastMessage}</div>
      )}
    </div>
  );
}

const styles = {
  row: {
    padding: '12px 16px',
    cursor: 'pointer',
  },
  title: {
    fontWeight: 500,
  },
  preview: {
    fontSize: '13px',
    color: '#888',
    marginTop: '2px',
  },
};
