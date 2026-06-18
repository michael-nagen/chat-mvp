import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { Message } from '../../memory/entities';
import { MessagesRepository } from '../messages.repository';
import { decodeCursor } from '../messages.cursor';

// In-memory driver. Mirrors the Mongo driver's keyset semantics so behavior is
// identical regardless of STORAGE_DRIVER.
@Injectable()
export class InMemoryMessagesRepository extends MessagesRepository {
  constructor(private readonly store: InMemoryStoreService) {
    super();
  }

  findPage({
    conversationId,
    cursor,
    limit,
  }: {
    conversationId: string;
    cursor: string | undefined;
    limit: number;
  }): Promise<Message[]> {
    let rows = this.store.messages.filter(
      (m) => m.conversationId === conversationId,
    );
    rows.sort(ascending);
    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      const t = createdAt.getTime();
      rows = rows.filter((m) => {
        const mt = new Date(m.createdAt).getTime();
        return mt > t || (mt === t && m.id > id);
      });
    }
    return Promise.resolve(rows.slice(0, limit + 1));
  }

  matchContent({
    conversationIds,
    needle,
    cursor,
    limit,
  }: {
    conversationIds: Set<string>;
    needle: string;
    cursor: string | undefined;
    limit: number;
  }): Promise<Message[]> {
    let rows = this.store.messages.filter(
      (m) =>
        conversationIds.has(m.conversationId) &&
        m.content.toLowerCase().includes(needle),
    );
    rows.sort(descending);
    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      const t = createdAt.getTime();
      rows = rows.filter((m) => {
        const mt = new Date(m.createdAt).getTime();
        return mt < t || (mt === t && m.id < id);
      });
    }
    return Promise.resolve(rows.slice(0, limit + 1));
  }

  insert(message: Message): Promise<Message> {
    this.store.messages.push(message);
    return Promise.resolve(message);
  }
}

function ascending(a: Message, b: Message): number {
  const delta = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  return delta !== 0 ? delta : a.id.localeCompare(b.id);
}

function descending(a: Message, b: Message): number {
  return -ascending(a, b);
}
