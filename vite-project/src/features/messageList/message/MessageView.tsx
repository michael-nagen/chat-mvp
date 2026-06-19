import { messageStyles } from './Message.styles';
import { useMessage } from './Message.context';
import { MessageAvatar } from './children/MessageAvatar';
import { MessageSenderName } from './children/MessageSenderName';
import { MessageBubble } from './children/MessageBubble';
import { MessageTime } from './children/MessageTime';

export function MessageView(): React.JSX.Element {
  const { message } = useMessage();
  const isUser = message.sender === 'user';

  return (
    <div style={messageStyles.row(isUser)}>
      <MessageAvatar />
      <div style={messageStyles.column(isUser)}>
        <MessageSenderName />
        <MessageBubble />
        <MessageTime />
      </div>
    </div>
  );
}
