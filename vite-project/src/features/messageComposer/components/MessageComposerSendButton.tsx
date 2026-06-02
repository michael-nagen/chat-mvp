import type { MessageComposerSendButtonProps } from '../MessageComposer.types';
import { SEND_LABEL, SENDING_LABEL } from './MessageComposer.constants';
import { messageComposerStyles } from './MessageComposer.styles';

/** Send button that reflects sendable and in-flight state. */
export function MessageComposerSendButton({
  sendable,
  isSending,
}: MessageComposerSendButtonProps): React.JSX.Element {
  return (
    <button type="submit" disabled={!sendable} style={messageComposerStyles.button(sendable)}>
      {isSending ? SENDING_LABEL : SEND_LABEL}
    </button>
  );
}
