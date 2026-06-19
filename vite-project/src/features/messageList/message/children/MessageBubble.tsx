import { messageStyles } from '../Message.styles';
import { useMessage } from '../Message.context';

export function MessageBubble(): React.JSX.Element {
  const { message } = useMessage();
  const isUser = message.sender === 'user';

  return <div style={messageStyles.bubble(isUser)}>{message.content}</div>;
}
