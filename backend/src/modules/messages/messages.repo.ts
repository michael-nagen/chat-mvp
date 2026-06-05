import { Message } from './messages.types';
import { messages } from '../../shared/store/inMemoryStore';

const byCreatedAtAsc = (a: Message, b: Message): number =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

/**
 * Returns up to `limit + 1` messages for a conversation, oldest -> newest,
 * starting just after `cursor` (a message id). The extra record lets the
 * caller tell whether another page exists without a second query.
 *
 * If `cursor` is omitted the first page is returned. An unknown cursor id
 * (e.g. a deleted message) falls back to the first page.
 */
const findPage = (
  conversationId: string,
  cursor: string | undefined,
  limit: number,
): Message[] => {
  const ordered = messages
    .filter((message) => message.conversationId === conversationId)
    .sort(byCreatedAtAsc);

  const start = cursor ? ordered.findIndex((message) => message.id === cursor) + 1 : 0;

  return ordered.slice(start, start + limit + 1);
};

const insert = (message: Message): Message => {
  messages.push(message);
  return message;
};

export const messageRepository = {
  findPage,
  insert,
};
