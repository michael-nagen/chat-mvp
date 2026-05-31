import type { MessageComposerViewProps } from "./MessageComposer.types";
import {
  ACTIVE_BUTTON_COLOR,
  DISABLED_BUTTON_COLOR,
  PLACEHOLDER_TEXT,
  SEND_LABEL,
  SENDING_LABEL,
} from "./MessageComposer.constants";

/** Renders the textarea and send button; Enter submits, Shift+Enter inserts a newline. */
export function MessageComposerView({
  value,
  onChange,
  isSending,
  sendable,
  handleSubmit,
  handleKeyDown,
}: MessageComposerViewProps) {
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER_TEXT}
        rows={1}
        disabled={isSending}
        style={styles.textarea}
      />
      <button type="submit" disabled={!sendable} style={styles.button(sendable)}>
        {isSending ? SENDING_LABEL : SEND_LABEL}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  form: {
    display: "flex",
    gap: "8px",
    padding: "8px",
    borderTop: "1px solid #eee",
    alignItems: "flex-end",
  },
  textarea: {
    flex: 1,
    padding: "8px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "none" as const,
    fontFamily: "inherit",
    fontSize: "inherit",
  },
  button: (sendable: boolean): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: sendable ? ACTIVE_BUTTON_COLOR : DISABLED_BUTTON_COLOR,
    color: "white",
    cursor: sendable ? "pointer" : "default",
  }),
};
