import type { MessageListViewProps } from './MessageList.types';
import { useAutoScroll } from './MessageListAutoScroll.use';
import { messageListStyles } from './MessageList.styles';
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
}: MessageListViewProps): React.JSX.Element {
  const bottomRef = useAutoScroll(messages);
  let content: React.JSX.Element;

  if (!hasSelectedConversation) {
    content = <div style={messageListStyles.center}>Select a conversation to start</div>;
  } else if (isLoading) {
    content = <MessageSkeletonList />;
  } else if (error) {
    content = <div style={messageListStyles.error}>{error}</div>;
  } else if (messages.length === 0) {
    content = <div style={messageListStyles.center}>No messages yet</div>;
  } else {
    content = (
      <div style={messageListStyles.list}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>
    );
  }

  return content;
}
