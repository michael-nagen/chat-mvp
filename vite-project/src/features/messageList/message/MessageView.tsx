import { messageStyles } from './Message.styles';
import { useMessage } from './Message.context';
import { MessageAvatar } from './children/MessageAvatar';
import { MessageSenderName } from './children/MessageSenderName';
import { MessageBubble } from './children/MessageBubble';
import { MessageCitations } from './children/messageCitations/MessageCitations';
import { MessagePendingStatus } from './children/MessagePendingStatus';
import { MessageUploadCard } from './children/MessageUploadCard';
import { MessageTime } from './children/MessageTime';

export function MessageView(): React.JSX.Element {
  const { message } = useMessage();
  const isUser = message.sender === 'user';
  const isUploadEvent = message.metadata?.kind === 'knowledge_upload';

  return (
    <div style={messageStyles.row(isUser)}>
      <MessageAvatar />
      <div style={messageStyles.column(isUser)}>
        <MessageSenderName />
        {isUploadEvent ? (
          <MessageUploadCard />
        ) : (
          <>
            <MessageBubble />
            <MessagePendingStatus />
            <MessageCitations />
          </>
        )}
        <MessageTime />
      </div>
    </div>
  );
}
