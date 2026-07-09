import type { MessageComposerViewProps } from '../MessageComposer.types';
import { messageComposerStyles } from './MessageComposer.styles';
import { MessageComposerTextarea } from './MessageComposerTextarea';
import { MessageComposerSendButton } from './MessageComposerSendButton';
import { KnowledgeUploadSlot } from '../../knowledgeUpload';

/** Composes the draft textarea and send button into the composer form. */
export function MessageComposerView({
  value,
  onChange,
  isSending,
  sendable,
  handleSubmit,
  handleKeyDown,
}: MessageComposerViewProps): React.JSX.Element {
  return (
    <form onSubmit={handleSubmit} style={messageComposerStyles.form}>
      <MessageComposerTextarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        isSending={isSending}
      />
      <KnowledgeUploadSlot />
      <MessageComposerSendButton sendable={sendable} isSending={isSending} />
    </form>
  );
}
