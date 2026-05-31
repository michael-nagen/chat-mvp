import type { MessageComposerProps } from "./MessageComposer.types";
import { useMessageComposer } from "./MessageComposer.use";

/** Renders the textarea and send button; Enter submits, Shift+Enter inserts a newline. */
export function MessageComposerView(props: MessageComposerProps) {
  const { sendable, handleSubmit, handleKeyDown } = useMessageComposer(props);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        disabled={props.isSending}
        style={styles.textarea}
      />
      <button type="submit" disabled={!sendable} style={styles.button(sendable)}>
        {props.isSending ? "Sending..." : "Send"}
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
    backgroundColor: sendable ? "#0084ff" : "#ccc",
    color: "white",
    cursor: sendable ? "pointer" : "default",
  }),
};
