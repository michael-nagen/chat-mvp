import type { Message } from '../shared/contract/contract';
import {
  ASSISTANT_BUBBLE_BG,
  ASSISTANT_BUBBLE_COLOR,
  BUBBLE_MAX_WIDTH,
  SKELETON_WIDTHS,
  USER_BUBBLE_BG,
  USER_BUBBLE_COLOR,
} from './Message.constants';

/** A single chat bubble — blue on the right for the user, grey on the left for the assistant. */
export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  return (
    <div
      style={{
        ...styles.bubble,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        background: isUser ? USER_BUBBLE_BG : ASSISTANT_BUBBLE_BG,
        color: isUser ? USER_BUBBLE_COLOR : ASSISTANT_BUBBLE_COLOR,
      }}
    >
      {message.content}
    </div>
  );
}

/** Animated placeholder bubbles shown while the message thread is loading. */
export function MessageSkeletonList() {
  return (
    <div style={styles.list} aria-busy="true" aria-label="Loading messages">
      {SKELETON_WIDTHS.map((width, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            ...styles.bubble,
            alignSelf: i % 2 === 1 ? 'flex-end' : 'flex-start',
            width,
            height: '32px',
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  list: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  bubble: {
    maxWidth: BUBBLE_MAX_WIDTH,
    padding: '8px 12px',
    borderRadius: '12px',
  },
};
