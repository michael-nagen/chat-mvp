import { Message } from '../../common/storage/entities';
import { MessagePageResponse, MessageResponse } from './messages.types';

// createdAt is exposed to the FE as timestamp.
export const toMessageResponse = (message: Message): MessageResponse => ({
  id: message.id,
  conversationId: message.conversationId,
  senderId: message.senderId,
  content: message.content,
  timestamp: message.createdAt,
});

export const toMessagePageResponse = (
  messages: Message[],
  nextCursor: string | null,
): MessagePageResponse => ({
  messages: messages.map(toMessageResponse),
  nextCursor,
});
