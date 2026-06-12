import type { Message } from '../../../shared/entities/Message.types';
import { sendUserMessage } from './MessageComposer.api';
import { toMessage } from '../../../shared/entities/Message.mapper';

type ThreadActions = {
  addOptimisticMessage: (message: Message) => void;
  confirmMessage: (tempId: string, message: Message) => void;
  rollbackMessage: (tempId: string) => void;
};

export type SendResult = { ok: true } | { ok: false; error: string };

/** Runs the optimistic send: add temp message, post, then confirm or roll back. */
export async function sendOptimisticMessage({
  conversationId,
  content,
  userId,
  thread,
}: {
  conversationId: string;
  content: string;
  userId: string | null;
  thread: ThreadActions;
}): Promise<SendResult> {
  const optimistic = createOptimisticMessage({ conversationId, content });
  thread.addOptimisticMessage(optimistic);
  try {
    const res = await sendUserMessage({ conversationId, content });
    thread.confirmMessage(optimistic.id, toMessage({ raw: res.message, currentUserId: userId }));
    return { ok: true };
  } catch (err) {
    thread.rollbackMessage(optimistic.id);
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to send message' };
  }
}

/** Returns true only when there is non-empty text and no send is in flight. */
export function canSend({ value, isSending }: { value: string; isSending: boolean }): boolean {
  return value.trim().length > 0 && !isSending;
}

/** Builds an optimistic user message with a temporary id, shown before the server confirms. */
export function createOptimisticMessage({
  conversationId,
  content,
}: {
  conversationId: string;
  content: string;
}): Message {
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
export function createSubmitHandler({
  sendable,
  onSend,
}: {
  sendable: boolean;
  onSend: () => void;
}): (event: React.FormEvent<HTMLFormElement>) => void {
  return (event) => {
    event.preventDefault();
    if (sendable) onSend();
  };
}

/** Builds the textarea keydown handler: Enter submits (when allowed), Shift+Enter inserts a newline. */
export function createKeyDownHandler({
  sendable,
  onSend,
}: {
  sendable: boolean;
  onSend: () => void;
}): (event: React.KeyboardEvent<HTMLTextAreaElement>) => void {
  return (event) => {
    if (!isSubmitKey(event)) return;
    event.preventDefault();
    if (sendable) onSend();
  };
}
