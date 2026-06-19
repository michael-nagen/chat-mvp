import { messageStyles } from '../Message.styles';
import { useChatParticipants } from '../../../chatPage/ChatParticipants.context';
import { useMessage } from '../Message.context';

export function MessageSenderName(): React.JSX.Element | null {
  const { message } = useMessage();
  const sender = useChatParticipants().getSender(message.senderId);

  if (message.sender === 'user') return null;

  return <span style={messageStyles.senderName}>{sender?.displayName ?? 'Unknown'}</span>;
}
