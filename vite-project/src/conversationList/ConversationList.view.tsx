import type { ConversationListViewProps, ConversationRowViewModel } from "./ConversationList.types";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated placeholder rows shown while conversations are loading. */
function ConversationSkeletonList() {
  return (
    <div style={styles.column} aria-busy="true" aria-label="Loading conversations">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={styles.skeletonRow}>
          <div className="skeleton" style={{ height: "14px", width: "60%" }} />
          <div className="skeleton" style={{ height: "12px", width: "85%" }} />
        </div>
      ))}
    </div>
  );
}

/** A single conversation row — highlighted when selected. */
function ConversationRow({
  conversation,
  isSelected,
  onSelect,
}: ConversationRowViewModel & { onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{
        ...styles.row,
        background: isSelected ? "#e8f0fe" : "transparent",
        borderLeft: isSelected ? "3px solid #0084ff" : "3px solid transparent",
      }}
    >
      <div style={styles.rowTitle}>{conversation.title}</div>
      {conversation.lastMessage && (
        <div style={styles.rowPreview}>{conversation.lastMessage}</div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

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
    return <div style={{ ...styles.center, color: "red" }}>{error}</div>;
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

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  column: {
    display: "flex",
    flexDirection: "column" as const,
  },
  skeletonRow: {
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  row: {
    padding: "12px 16px",
    cursor: "pointer",
  },
  rowTitle: {
    fontWeight: 500,
  },
  rowPreview: {
    fontSize: "13px",
    color: "#888",
    marginTop: "2px",
  },
  center: {
    padding: "16px",
    color: "#888",
  },
};
