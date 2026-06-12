import type { Message, RawMessage } from './Message.types';

export function toMessage({
  raw,
  currentUserId,
}: {
  raw: RawMessage;
  currentUserId: string | null;
}): Message {
  return {
    id: raw.id,
    conversationId: raw.conversationId,
    content: raw.content,
    sender: raw.senderId === currentUserId ? 'user' : 'assistant',
    timestamp: raw.timestamp,
  };
}
