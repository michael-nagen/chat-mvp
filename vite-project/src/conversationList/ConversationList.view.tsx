import { ConversationRow } from '../conversation';
import type { ConversationListViewProps } from './ConversationList.types';
import { SKELETON_COUNT } from './ConversationList.constants';

/** Animated placeholder rows shown while conversations are loading. */
function ConversationSkeletonList() {
  return (
    <div style={styles.column} aria-busy="true" aria-label="Loading conversations">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} style={styles.skeletonRow}>
          <div className="skeleton" style={{ height: '14px', width: '60%' }} />
          <div className="skeleton" style={{ height: '12px', width: '85%' }} />
        </div>
      ))}
    </div>
  );
}

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
  rows,
  isLoading,
  error,
  onSelectConversation,
}: ConversationListViewProps) {
  if (isLoading) return <ConversationSkeletonList />;

  if (error) {
    return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;
  }

  if (rows.length === 0) {
    return <div style={styles.center}>No conversations yet</div>;
  }

  return (
    <div style={styles.column}>
      {rows.map(({ conversation, isSelected }) => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          isSelected={isSelected}
          onSelect={() => onSelectConversation(conversation.id)}
        />
      ))}
    </div>
  );
}

const styles = {
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  skeletonRow: {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  center: {
    padding: '16px',
    color: '#888',
  },
};
