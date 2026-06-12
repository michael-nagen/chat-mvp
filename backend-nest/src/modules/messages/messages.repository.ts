import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../common/store/in-memory-store.service';
import { Message } from '../../common/store/entities';

@Injectable()
export class MessagesRepository {
  constructor(private readonly store: InMemoryStoreService) {}

  // Over-fetches one past `limit` so the caller can detect a further page.
  findPage({
    conversationId,
    cursor,
    limit,
  }: {
    conversationId: string;
    cursor: string | undefined;
    limit: number;
  }): Message[] {
    const ordered = this.store.messages
      .filter((message) => message.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const start = cursor
      ? ordered.findIndex((message) => message.id === cursor) + 1
      : 0;

    return ordered.slice(start, start + limit + 1);
  }

  insert(message: Message): Message {
    this.store.messages.push(message);
    return message;
  }
}
