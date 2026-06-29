import { Avatar } from '../../../../shared/components/Avatar';
import { useChatParticipants } from '../../../chatPage/ChatParticipants.context';
import { useMessage } from '../Message.context';
import { AVATAR_SIZE } from '../Message.constants';

export function MessageAvatar(): React.JSX.Element {
  const { message } = useMessage();
  const isUser = message.sender === 'user';
  const sender = useChatParticipants().getSender(message.senderId);

  return (
    <Avatar
      src={sender?.avatarUrl ?? null}
      name={isUser ? '' : (sender?.displayName ?? 'Unknown')}
      size={AVATAR_SIZE}
    />
  );
}
