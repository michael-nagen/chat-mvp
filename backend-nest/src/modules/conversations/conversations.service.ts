import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConversationsRepository } from './conversations.repository';
import { Conversation } from '../../common/store/entities';
import { TxContext } from '../../common/storage/unit-of-work';

@Injectable()
export class ConversationsService {
  constructor(private readonly repo: ConversationsRepository) {}

  getForUser(userId: string): Promise<Conversation[]> {
    return this.repo.getForUser(userId);
  }

  findBetween({
    userId,
    recipientId,
  }: {
    userId: string;
    recipientId: string;
  }): Promise<Conversation | undefined> {
    return this.repo.findBetween(userId, recipientId);
  }

  create({
    participantIds,
    title,
  }: {
    participantIds: string[];
    title: string;
  }): Promise<Conversation> {
    const conversation: Conversation = {
      id: `c-${randomUUID()}`,
      title,
      participantIds,
      lastMessage: '',
      updatedAt: new Date().toISOString(),
    };
    return this.repo.insert(conversation);
  }

  getById(id: string): Promise<Conversation | undefined> {
    return this.repo.findById(id);
  }

  updateLastMessage(
    {
      id,
      lastMessage,
      updatedAt,
    }: {
      id: string;
      lastMessage: string;
      updatedAt: string;
    },
    tx?: TxContext,
  ): Promise<Conversation | undefined> {
    return this.repo.updateLastMessage({ id, lastMessage, updatedAt }, tx);
  }
}
