import type { MessageThreadListProps } from '../MessageList.types';
import { useAutoScroll } from '../MessageListAutoScroll.use';
import { messageListStyles } from './MessageList.styles';
import { MessageView } from '../message';

/** The scrollable thread of message bubbles, auto-scrolled to the latest. */
export function MessageThreadList({ messages }: MessageThreadListProps): React.JSX.Element {
  const bottomRef = useAutoScroll(messages);

  return (
    <div style={messageListStyles.list}>
      {messages.map((message) => (
        <MessageView key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
