import { Message, MessagePage, MessagePageResponse, MessageResponse } from './messages.types';

// `sender` is relative to the caller: own messages are 'user', others 'assistant'.
export const toMessageResponse = (message: Message, currentUserId: string): MessageResponse => ({
  id: message.id,
  conversationId: message.conversationId,
  content: message.content,
  sender: message.senderId === currentUserId ? 'user' : 'assistant',
  timestamp: message.createdAt,
});

export const toMessagePageResponse = (
  page: MessagePage,
  currentUserId: string,
): MessagePageResponse => ({
  messages: page.messages.map((message) => toMessageResponse(message, currentUserId)),
  nextCursor: page.nextCursor,
});
