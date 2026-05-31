import type { Message } from "../shared/contract/contract";
import type { MessageListViewProps } from "./MessageList.types";
import { useAutoScroll } from "./MessageList.use";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated placeholder rows shown while messages are loading. */
function SkeletonList() {
  const widths = ["55%", "40%", "65%", "35%", "50%"];
  return (
    <div style={styles.list} aria-busy="true" aria-label="Loading messages">
      {widths.map((width, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            ...styles.bubble,
            alignSelf: i % 2 === 1 ? "flex-end" : "flex-start",
            width,
            height: "32px",
          }}
        />
      ))}
    </div>
  );
}

/** A single chat bubble — blue on the right for the user, grey on the left for the assistant. */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  return (
    <div
      style={{
        ...styles.bubble,
        alignSelf: isUser ? "flex-end" : "flex-start",
        background: isUser ? "#0084ff" : "#f1f1f1",
        color: isUser ? "white" : "black",
      }}
    >
      {message.content}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

/**
 * Displays the message thread for the selected conversation.
 *
 * States (in order of priority):
 *  1. No conversation selected → prompt to pick one
 *  2. Loading           → skeleton bubbles
 *  3. Error             → inline error text
 *  4. Empty thread      → empty-state message
 *  5. Messages          → scrollable list, auto-scrolled to the bottom
 */
export function MessageListView({
  messages,
  isLoading,
  error,
  hasSelectedConversation,
}: MessageListViewProps) {
  const bottomRef = useAutoScroll(messages);

  if (!hasSelectedConversation) {
    return <div style={styles.center}>Select a conversation to start</div>;
  }

  if (isLoading) return <SkeletonList />;

  if (error) {
    return <div style={{ ...styles.center, color: "red" }}>{error}</div>;
  }

  if (messages.length === 0) {
    return <div style={styles.center}>No messages yet</div>;
  }

  return (
    <div style={styles.list}>
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  list: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  bubble: {
    maxWidth: "70%",
    padding: "8px 12px",
    borderRadius: "12px",
  },
  center: {
    padding: "16px",
    color: "#888",
  },
};
