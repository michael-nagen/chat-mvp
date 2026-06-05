import { randomUUID } from 'crypto';
import { messageRepository } from './messages.repo';
import { GetMessagesOptions, Message, MessagePage } from './messages.types';

export const messageService = {
  getMessages(conversationId: string, options: GetMessagesOptions): MessagePage {
    // The repo returns one extra row (limit + 1). If it came back, there's at
    // least one more message, so we trim to `limit` and hand back the last id
    // as the cursor for the next page. Otherwise this is the final page.
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
