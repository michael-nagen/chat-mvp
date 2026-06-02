import type { MessageViewProps } from './Message.types';
import { messageStyles } from './Message.styles';

/** A single chat bubble — blue on the right for the user, grey on the left for the assistant. */
export function MessageView({ message }: MessageViewProps): React.JSX.Element {
  const isUser = message.sender === 'user';

  return (
    <div
      style={messageStyles.bubble(isUser)}
    >
      {message.content}
    </div>
  );
}
