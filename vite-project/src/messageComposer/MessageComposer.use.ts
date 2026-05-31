import type { MessageComposerProps } from "./MessageComposer.types";
import { canSend } from "./MessageComposer.logic";

export function useMessageComposer({ value, isSending, onSend }: MessageComposerProps) {
  const sendable = canSend(value, isSending);

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    if (!sendable) return;
    onSend();
  }

  // Enter submits, Shift+Enter inserts a newline.
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (sendable) onSend();
    }
  }

  return { sendable, handleSubmit, handleKeyDown };
}
