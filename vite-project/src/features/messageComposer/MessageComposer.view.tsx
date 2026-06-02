import type { MessageComposerViewProps } from "./MessageComposer.types";
import {
  PLACEHOLDER_TEXT,
  SEND_LABEL,
  SENDING_LABEL,
} from "./MessageComposer.constants";
import { messageComposerStyles } from "./MessageComposer.styles";

/** Renders the textarea and send button; Enter submits, Shift+Enter inserts a newline. */
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER_TEXT}
        rows={1}
        disabled={isSending}
        style={messageComposerStyles.textarea}
      />
      <button type="submit" disabled={!sendable} style={messageComposerStyles.button(sendable)}>
        {isSending ? SENDING_LABEL : SEND_LABEL}
      </button>
    </form>
  );
}
