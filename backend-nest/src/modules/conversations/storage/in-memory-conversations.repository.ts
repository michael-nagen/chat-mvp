import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { Conversation } from '../../../common/storage/entities';
import { ConversationsRepository } from '../conversations.repository';
import { ConflictException } from '../../../common/errors/app.exception';

// In-memory driver for conversations, backed by the shared seed store.
@Injectable()
export class InMemoryConversationsRepository extends ConversationsRepository {
  constructor(private readonly store: InMemoryStoreService) {
    super();
  }

  getForUser(userId: string): Promise<Conversation[]> {
    const rows = this.store.conversations
      .filter((c) => c.participantIds.includes(userId))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    return Promise.resolve(rows);
  }

  findByDmKey(dmKey: string): Promise<Conversation | undefined> {
    return Promise.resolve(
      this.store.conversations.find((c) => c.dmKey === dmKey),
    );
  }

  insert(conversation: Conversation): Promise<Conversation> {
    // Mirrors the Mongo partial unique `dmKey` index: the loser of a concurrent
    // create (both past the service's findByDmKey pre-check) is rejected here.
    // The store is the single source of truth, so seeded DMs are covered too.
    if (
      conversation.dmKey !== undefined &&
      this.store.conversations.some((c) => c.dmKey === conversation.dmKey)
    ) {
      throw new ConflictException('Conversation already exists.');
    }
    this.store.conversations.push(conversation);
    return Promise.resolve(conversation);
  }

  findById(id: string): Promise<Conversation | undefined> {
    return Promise.resolve(this.store.conversations.find((c) => c.id === id));
  }

  updateLastMessage({
    id,
    lastMessage,
    updatedAt,
  }: {
    id: string;
    lastMessage: string;
    updatedAt: string;
  }): Promise<Conversation | undefined> {
    const conversation = this.store.conversations.find((c) => c.id === id);
    if (!conversation) {
      return Promise.resolve(undefined);
    }
    conversation.lastMessage = lastMessage;
    conversation.updatedAt = updatedAt;
    return Promise.resolve(conversation);
  }
}
