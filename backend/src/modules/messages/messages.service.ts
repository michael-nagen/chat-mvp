import { randomUUID } from 'crypto';
import { messageRepository } from './messages.repo';
import { GetMessagesOptions, Message, MessagePage } from './messages.types';

export const messageService = {
  getMessages(conversationId: string, options: GetMessagesOptions): MessagePage {
    const rows = messageRepository.findPage(conversationId, options.cursor, options.limit);
    const hasMore = rows.length > options.limit;
    const messages = hasMore ? rows.slice(0, options.limit) : rows;
    const nextCursor = hasMore ? messages[messages.length - 1].id : null;

    return { messages, nextCursor };
  },

  createMessage(conversationId: string, senderId: string, content: string): Message {
    const now = new Date();
    const message: Message = {
      id: `m-${randomUUID()}`,
      conversationId,
      senderId,
      content,
      createdAt: now.toISOString(),
    };
    messageRepository.insert(message);
    return message;
  },
};
