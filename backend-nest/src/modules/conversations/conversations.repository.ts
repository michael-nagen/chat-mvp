import { Injectable } from '@nestjs/common';
import { InMemoryStoreService } from '../../common/store/in-memory-store.service';
import { Conversation } from '../../common/store/entities';

@Injectable()
export class ConversationsRepository {
  constructor(private readonly store: InMemoryStoreService) {}

  getForUser(userId: string): Conversation[] {
    return this.store.conversations.filter((c) =>
      c.participantIds.includes(userId),
    );
  }

  findBetween(userId: string, recipientId: string): Conversation | undefined {
    return this.store.conversations.find(
      (c) =>
        c.participantIds.includes(userId) &&
        c.participantIds.includes(recipientId),
    );
  }

  insert(conversation: Conversation): Conversation {
    this.store.conversations.push(conversation);
    return conversation;
  }

  findById(id: string): Conversation | undefined {
    return this.store.conversations.find((c) => c.id === id);
  }

  updateLastMessage({
    id,
    lastMessage,
    updatedAt,
  }: {
    id: string;
    lastMessage: string;
    updatedAt: string;
  }): Conversation | undefined {
    const conversation = this.findById(id);
    if (!conversation) {
      return undefined;
    }
    conversation.lastMessage = lastMessage;
    conversation.updatedAt = updatedAt;
    return conversation;
  }
}
