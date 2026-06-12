import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../common/store/in-memory-store.service';
import { Conversation, Message } from '../../common/store/entities';

@Injectable()
export class SearchRepository {
  constructor(private readonly store: InMemoryStoreService) {}

  conversationsForUser(userId: string): Conversation[] {
    return this.store.conversations.filter((c) =>
      c.participantIds.includes(userId),
    );
  }

  // `needle` is expected pre-lowercased. Newest first.
  matchMessages({
    conversationIds,
    needle,
  }: {
    conversationIds: Set<string>;
    needle: string;
  }): Message[] {
    return this.store.messages
      .filter(
        (m) =>
          conversationIds.has(m.conversationId) &&
          m.content.toLowerCase().includes(needle),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}
