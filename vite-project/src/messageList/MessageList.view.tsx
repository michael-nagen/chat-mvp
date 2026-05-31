import type { MessageListViewProps } from './MessageList.types';
import { useAutoScroll } from './MessageList.use';
import { MessageBubble, MessageSkeletonList } from '../message';

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

  if (isLoading) return <MessageSkeletonList />;

  if (error) {
    return <div style={{ ...styles.center, color: 'red' }}>{error}</div>;
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

const styles = {
  list: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  center: {
    padding: '16px',
    color: '#888',
  },
};
