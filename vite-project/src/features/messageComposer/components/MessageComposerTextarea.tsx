import type { MessageComposerTextareaProps } from '../MessageComposer.types';
import { PLACEHOLDER_TEXT } from './MessageComposer.constants';
import { messageComposerStyles } from './MessageComposer.styles';

/** Draft textarea; key handling (Enter to submit, Shift+Enter for newline) comes via onKeyDown. */
export function MessageComposerTextarea({
  value,
  onChange,
  onKeyDown,
  isSending,
}: MessageComposerTextareaProps): React.JSX.Element {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={PLACEHOLDER_TEXT}
      rows={1}
      disabled={isSending}
      style={messageComposerStyles.textarea}
    />
  );
}
