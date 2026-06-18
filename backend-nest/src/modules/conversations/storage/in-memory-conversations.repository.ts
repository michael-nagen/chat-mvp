import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../memory/in-memory-store.service';
import { Conversation } from '../../memory/entities';
import { ConversationsRepository } from '../conversations.repository';

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

  findBetween(
    userId: string,
    recipientId: string,
  ): Promise<Conversation | undefined> {
    return Promise.resolve(
      this.store.conversations.find(
        (c) =>
          c.participantIds.includes(userId) &&
          c.participantIds.includes(recipientId),
      ),
    );
  }

  insert(conversation: Conversation): Promise<Conversation> {
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
