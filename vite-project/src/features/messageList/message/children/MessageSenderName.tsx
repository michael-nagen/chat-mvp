import { messageStyles } from '../Message.styles';
import { useChatParticipants } from '../../../chatPage/ChatParticipants.context';
import { useMessage } from '../Message.context';

export function MessageSenderName(): React.JSX.Element | false {
  const { message } = useMessage();
  const sender = useChatParticipants().getSender(message.senderId);

  return (
    message.sender !== 'user' && (
      <span style={messageStyles.senderName}>{sender?.displayName ?? 'Unknown'}</span>
    )
  );
}
