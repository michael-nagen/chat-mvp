import type { MessageBubbleProps } from './Message.types';
import { messageStyles } from './Message.styles';

/** A single chat bubble — blue on the right for the user, grey on the left for the assistant. */
export function MessageBubble({ message }: MessageBubbleProps): React.JSX.Element {
  const isUser = message.sender === 'user';

  return (
    <div
      style={messageStyles.bubble(isUser)}
    >
      {message.content}
    </div>
  );
}
