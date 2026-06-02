import type { Message } from '../../../shared/entities/Message.types';

/** Returns true only when there is non-empty text and no send is in flight. */
export function canSend(value: string, isSending: boolean): boolean {
  return value.trim().length > 0 && !isSending;
}

/** Builds an optimistic user message with a temporary id, shown before the server confirms. */
export function createOptimisticMessage(conversationId: string, content: string): Message {
  return {
    id: `temp-${Date.now()}`,
    conversationId,
    sender: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
}

/** True when a textarea keydown should submit the message (Enter without Shift). */
export function isSubmitKey(event: React.KeyboardEvent<HTMLTextAreaElement>): boolean {
  return event.key === 'Enter' && !event.shiftKey;
}

/** Builds the form submit handler: prevents default and sends when allowed. */
export function createSubmitHandler(
  sendable: boolean,
  onSend: () => void,
): (event: React.FormEvent<HTMLFormElement>) => void {
  return (event) => {
    event.preventDefault();
    if (sendable) onSend();
  };
}

/** Builds the textarea keydown handler: Enter submits (when allowed), Shift+Enter inserts a newline. */
export function createKeyDownHandler(
  sendable: boolean,
  onSend: () => void,
): (event: React.KeyboardEvent<HTMLTextAreaElement>) => void {
  return (event) => {
    if (!isSubmitKey(event)) return;
    event.preventDefault();
    if (sendable) onSend();
  };
}
