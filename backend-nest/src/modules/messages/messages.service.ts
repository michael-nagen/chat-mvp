import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { Message } from '../../common/store/entities';
import { MessagePage } from './messages.types';
import { encodeCursor } from './messages.cursor';
import { TxContext } from '../../common/storage/unit-of-work';

@Injectable()
export class MessagesService {
  constructor(private readonly repo: MessagesRepository) {}

  async listPage({
    conversationId,
    cursor,
    limit,
  }: {
    conversationId: string;
    cursor?: string;
    limit: number;
  }): Promise<MessagePage> {
    return this.paginate(
      await this.repo.findPage({ conversationId, cursor, limit }),
      limit,
    );
  }

  create(
    {
      conversationId,
      userId,
      content,
    }: {
      conversationId: string;
      userId: string;
      content: string;
    },
    tx?: TxContext,
  ): Promise<Message> {
    const message: Message = {
      id: `m-${randomUUID()}`,
      conversationId,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    };
    return this.repo.insert(message, tx);
  }

  // Caller pre-restricts to its own conversations by passing their ids.
  async searchContent({
    conversationIds,
    query,
    cursor,
    limit,
  }: {
    conversationIds: Set<string>;
    query: string;
    cursor?: string;
    limit: number;
  }): Promise<MessagePage> {
    return this.paginate(
      await this.repo.matchContent({
        conversationIds,
        needle: query.toLowerCase(),
        cursor,
        limit,
      }),
      limit,
    );
  }

  // Repo over-fetches limit+1; trim the extra and expose the last item as the
  // next (opaque, keyset) cursor.
  private paginate(rows: Message[], limit: number): MessagePage {
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1];
    const nextCursor =
      hasMore && last
        ? encodeCursor({ createdAt: last.createdAt, id: last.id })
        : null;
    return { items, nextCursor };
  }
}
